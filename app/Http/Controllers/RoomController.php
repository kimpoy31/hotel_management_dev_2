<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\Rate;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function room_form($id = null){

        if ($id) {
            $room = Room::find($id);
            return Inertia::render('Admin/RoomForm', [
                'room' => $room,
                'rates' => Rate::where('status','active')->get(),
                'inventory_items' => InventoryItem::where('status','active')->get(),
            ]);
        }

        return Inertia::render('Admin/RoomForm', [
            'rates' => Rate::where('status','active')->get(),
            'inventory_items' => InventoryItem::where('status','active')->get(),
        ]); 
    }


    public function room_form_submit(Request $request, $id = null){
        // Determine if we're updating or creating
        $isUpdating = $id !== null;
        $room = Room::find($id);

        // Validation rules
        $validator = Validator::make($request->all(), [
            'room_number' => [
                'required', 'string',
                $isUpdating 
                    ? Rule::unique('rooms', 'room_number')->ignore($id) 
                    : 'unique:rooms,room_number'
            ],
            'room_type' => ['required', 'string'],
            'room_rate_ids' => ['required', 'array','min:1'],
        ]);

        // If validation fails, return a 422 error with validation errors
        if ($validator->fails()) {
            return Inertia::render('Admin/RoomForm', [
                'rates' => Rate::where('status','active')->get(),
                'inventory_items' => InventoryItem::where('status','active')->get(),
                'errors' => $validator->errors()->toArray(),
                'room' => $room,
            ]);
        }

        if ($isUpdating) {
            $room = Room::find($id);
            $room->update([
                'room_number' => $request->input('room_number'),
                'room_type' => $request->input('room_type'),
                'room_rate_ids' => $request->input('room_rate_ids'),
                'room_inclusions' => json_decode($request->input('room_inclusions')),
            ]);
        } else {
        $room = Room::create([
            'room_number' => $request->input('room_number'),
            'room_type' => $request->input('room_type'),
            'room_rate_ids' => $request->input('room_rate_ids'),
            'room_inclusions' => json_decode($request->input('room_inclusions')),
        ]);
        }

        return to_route('admin');
    }
}
