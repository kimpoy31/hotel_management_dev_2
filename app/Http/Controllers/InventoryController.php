<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function item_delete($id = null){
        $inventory_item = InventoryItem::find($id);
        $rooms = Room::where('status', 'active')->get();

        // Check if $id exists in room_inclusions for any active room
        foreach ($rooms as $room) {
            // Use array_column to extract item_ids from room_inclusions
            $itemIds = array_column($room->room_inclusions ?? [], 'item_id');
        
            if (in_array($id, $itemIds)) {  // Check if $id is in the extracted item_ids
                // Return error if $id is found
                return Inertia::render('Admin/InventoryForm', [
                    'inventory_item' => InventoryItem::find($id),
                    'errors' => [
                        'delete_error' => ['Cannot delete. Deselect / remove from room manager first']
                    ]
                ]);
            }
        }
        
        $inventory_item->update([
            'status' => 'in-active'
        ]);

        return to_route('admin'); 
    }


    public function inventory_form($id = null){

        if ($id) {
            $inventory_item = InventoryItem::find($id);
            return Inertia::render('Admin/InventoryForm', [
                'inventory_item' => $inventory_item
            ]);
        }

        return Inertia::render('Admin/InventoryForm'); 
    }

    public function inventory_form_submit(Request $request, $id = null){         // Validate incoming data
        // Determine if we're updating or creating
       $isUpdating = $id !== null;

       // Validation rules
       $validator = Validator::make($request->all(), [
           'item_name' => ['required', 'string'],
           'item_type' => ['required', 'string' ],
           'available' => ['required', 'integer'],
           'price' => ['required', 'numeric', 'min:0.01'], 
       ]);

       // If validation fails, return a 422 error with validation errors
       if ($validator->fails()) {
           return Inertia::render('Admin/InventoryForm', [
               'errors' => $validator->errors()->toArray()
           ]);
       }

       if ($isUpdating) {
           $item = InventoryItem::find($id);
           $item->update([
            'item_name' => $request->input('item_name'),
            'item_type' => $request->input('item_type'),
            'available' => $request->input('available'),
            'price' => $request->input('price'),
           ]);
       } else { 
            InventoryItem::create([
                'item_name' => $request->input('item_name'),
                'item_type' => $request->input('item_type'),
                'available' => $request->input('available'),
                'price' => $request->input('price'),
            ]);
       }

       return to_route('admin');
   }
}
