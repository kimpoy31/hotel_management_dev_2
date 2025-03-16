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
    public function room_delete($id){
        $room = Room::find($id);

        if ($room->room_status != 'available') {
            return Inertia::render('Admin/RoomForm', [
                'room' => $room,
                'rates' => Rate::where('status','active')->get(),
                'inventory_items' => InventoryItem::where('status','active')->get(),
                'errors' => [
                    'delete_error' => ['Cannot delete. Room status should be "available" before it can be deleted']
                ]
            ]);
        }

        $room->update([
            'status' => 'in-active'
        ]);

        return to_route('admin');
    }


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
                    ? Rule::unique('rooms', 'room_number')
                        ->ignore($id)
                        ->where(function ($query) {
                            $query->where('status', '!=', 'in-active');
                        })
                    : Rule::unique('rooms', 'room_number')
                        ->where(function ($query) {
                            $query->where('status', '!=', 'in-active');
                        })
            ],
            'room_type' => ['required', 'string'],
            'room_rate_ids' => ['required', 'array', 'min:1'],
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
        
            $prevRoomInclusions = $room->room_inclusions ?? [];
            $newRoomInclusions = json_decode($request->input('room_inclusions'), true) ?? [];
        
            // Step 1: Find removed items (items that exist in previous inclusions but not in the new ones)
            $removedInclusions = collect($prevRoomInclusions)
                ->filter(function ($prevInclusion) use ($newRoomInclusions) {
                    return !collect($newRoomInclusions)->contains('item_id', $prevInclusion['item_id']);
                });
        
            // Restore stock only for removed items
            foreach ($removedInclusions as $removedInclusion) {
                $inventoryItem = InventoryItem::find($removedInclusion['item_id']);
                if ($inventoryItem) {
                    $inventoryItem->update([
                        'available' => $inventoryItem->available + $removedInclusion['quantity'],
                        'in_use' => $inventoryItem->in_use - $removedInclusion['quantity'],
                    ]);
                }
            }
        
            // Step 2: Adjust stock for existing and newly added items
            foreach ($newRoomInclusions as $newInclusion) {
                $inventoryItem = InventoryItem::find($newInclusion['item_id']);
                if ($inventoryItem) {
                    $prevInclusion = collect($prevRoomInclusions)->firstWhere('item_id', $newInclusion['item_id']);
                    if ($prevInclusion) {
                        // Existing item — adjust stock based on quantity difference
                        $quantityDifference = $newInclusion['quantity'] - $prevInclusion['quantity'];
                        if ($quantityDifference !== 0) {
                            $inventoryItem->update([
                                'available' => $inventoryItem->available - $quantityDifference,
                                'in_use' => $inventoryItem->in_use + $quantityDifference,
                            ]);
                        }
                    } else {
                        // New item — subtract from available and add to in-use
                        $inventoryItem->update([
                            'available' => $inventoryItem->available - $newInclusion['quantity'],
                            'in_use' => $inventoryItem->in_use + $newInclusion['quantity'],
                        ]);
                    }
                }
            }
        
            // Step 3: Update room details
            $room->update([
                'room_number' => $request->input('room_number'),
                'room_type' => $request->input('room_type'),
                'room_rate_ids' => $request->input('room_rate_ids'),
                'room_inclusions' => json_decode($request->input('room_inclusions'),true),
            ]);
        } else {
            $room = Room::create([
                'room_number' => $request->input('room_number'),
                'room_type' => $request->input('room_type'),
                'room_rate_ids' => $request->input('room_rate_ids'),
                'room_inclusions' => json_decode($request->input('room_inclusions'),true),
            ]);

             // Subtract from inventory on creation
            foreach (json_decode($request->input('room_inclusions'), true) as $inclusionItem) {
                $inventoryItem = InventoryItem::find($inclusionItem['item_id']);
                if ($inventoryItem) {
                    $inventoryItem->update([
                        'available' => $inventoryItem->available - $inclusionItem['quantity'],
                        'in_use' => $inventoryItem->in_use + $inclusionItem['quantity'],
                    ]);
                }
            }
        }

        return to_route('admin');
    }
}
