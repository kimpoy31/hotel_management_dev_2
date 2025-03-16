<?php

namespace App\Http\Controllers;

use App\Models\GeneralSetting;
use App\Models\InventoryItem;
use App\Models\Rate;
use App\Models\Room;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FrontdeskController extends Controller
{
    public function room_form ($id){
        $room = Room::find($id);

        return Inertia::render('Frontdesk/Room', [
            'room' => $room,
            'rates' => Rate::where('status', 'active')
                ->whereIn('id', $room->room_rate_ids ?? []) // ✅ Ensure it's an array or default to an empty array
                ->get(), // ✅ Add get() to execute the query
            'inventory_items' =>InventoryItem::where('status', 'active')->get()->toArray(),
            'active_transaction' => Transaction::find($room->active_transaction) ?? null,
        ]);
    }

    public function check_in (Request $request){
        // Validation rules
        $validator = Validator::make($request->all(), [
            'room_id' => ['required', 'integer'],
            'check_in' => ['required', 'date'],
            'expected_check_out' => ['required', 'date'],
            'number_of_hours' => ['required', 'integer'],
            'rate' => ['required', 'numeric', 'min:0.01'],
            'room_number' => ['required', 'string'],
            'customer_name' => ['required', 'string'],
            'customer_address' => ['required', 'string'],
            'id_picture' => ['nullable', 'file', 'max:2048', 'mimes:jpg,jpeg,png'], // 2048 KB = 2 MB
            'total_payment' => ['required', 'numeric', 'min:0.01'],
        ]);

        // If validation fails, return a 422 error with validation errors
        if ($validator->fails()) {
            return to_route('frontdesk.room.form', $request->room_id)->withErrors($validator);
        }

        
        $room = Room::find($request->input('room_id'));


        // * HANDLE ROOM ADDITIONS -> subtract additions from inventory -> available
        $room_additions = json_decode($request->input('room_additions'), true) ?? [];
    
        foreach($room_additions as $item){
            $inventoryItem = InventoryItem::find($item['item_id']);
            $quantity_to_update = $item['quantity'];
            
            $inventoryItem->update([
                'available' => $inventoryItem->available -= $quantity_to_update,
                'in_use' => $inventoryItem->in_use += $quantity_to_update,
            ]);
        }

        // * SAVE IF ID PICTURE IS PROVIDED
        if ($request->hasFile('id_picture') && $request->file('id_picture')->isValid()) {
            $idPicturePath = Storage::disk('public')->putFile('id_pictures', $request->file('id_picture'));
        }

        // GENERAL SETTINGS
        $generalSettings = GeneralSetting::find(1);

        $transaction = Transaction::create([
            'transaction_officer' => Auth::user()->fullname,
            'check_in' => $request->input('check_in'),
            'expected_check_out' => $request->input('expected_check_out'),
            'number_of_hours' => $request->input('number_of_hours'),
            'rate' => $request->input('rate'),
            'room_number' => $request->input('room_number'),
            'customer_name' => $request->input('customer_name'),
            'customer_address' => $request->input('customer_address'),
            'customer_contact_number' => $request->input('customer_contact_number'),
            'id_picture_path' => $idPicturePath ?? null,
            'room_additions' => json_decode($request->input('room_additions'),true),
            'total_payment' => $request->input('total_payment'),
            'overtime_charge' => $generalSettings->overtime_charge,
        ]);

        $room->update([
            'active_transaction' => $transaction->id,
            'room_status' => 'occupied'
        ]);
    }
}
