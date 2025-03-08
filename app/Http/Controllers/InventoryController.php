<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class InventoryController extends Controller
{
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
