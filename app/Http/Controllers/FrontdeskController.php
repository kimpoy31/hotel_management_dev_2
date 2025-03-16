<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\Rate;
use App\Models\Room;
use Illuminate\Http\Request;
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
            'inventory_items' =>InventoryItem::where('status', 'active')->get()->toArray()
        ]);
    }


    public function check_in (Request $request){
        // Validation rules
        $validator = Validator::make($request->all(), [
            'room_id' => ['required', 'integer'],
            'check_in' => ['required', 'date'],
            'expected_check_out' => ['required', 'date'],
            'number_of_hours' => ['required', 'integer'],
            'number_of_days' => ['required', 'integer'],
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
        $room_inclusions = $room->room_inclusions;
        $room_additions = json_decode($request->input('room_additions'), true) ?? [];
    
        // Merge both arrays
        $all_items = array_merge($room_inclusions, $room_additions);

        foreach($all_items as $item){
            $inventoryItem = InventoryItem::find($item['item_id']);
            $quantity_to_update = $item['quantity'];
            
            $inventoryItem->update([
                'available' => $inventoryItem->available -= $quantity_to_update,
                'in_use' => $inventoryItem->in_use += $quantity_to_update,
            ]);
        }
        
    }
}
