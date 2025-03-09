<?php

namespace App\Http\Controllers;

use App\Models\Rate;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class RateController extends Controller
{
    public function rate_delete($id){
        $rate = Rate::find($id);
        $rooms = Room::where('status','active')->get();

        // Check if $id exists in room_rates for any active room
        foreach ($rooms as $room) {
            if (in_array($id, $room->room_rate_ids ?? [])) {  // Use null coalescing to avoid errors if room_rates is null
                // Return error if $id is found
                return Inertia::render('Admin/RateForm', [
                    'rate' => Rate::find($id),
                    'errors' => [
                        'delete_error' => ['Cannot delete. Deselect / remove from room manager first']
                    ]
                ]);
            }
        }
        
        $rate->update([
            'status' => 'in-active'
        ]);
      
        return to_route('admin');
    }

    public function rate_form($id = null){

        if ($id) {
            $rate = Rate::find($id);
            return Inertia::render('Admin/RateForm', [
                'rate' => $rate
            ]);
        }

        return Inertia::render('Admin/RateForm'); 
    }

    public function rate_form_submit(Request $request, $id = null){         // Validate incoming data
        // Determine if we're updating or creating
       $isUpdating = $id !== null;

       // Validation rules
       $validator = Validator::make($request->all(), [
           'duration' => ['required', 'integer'],
           'rate' => ['required', 'numeric', 'min:0.01'],
       ]);

       // If validation fails, return a 422 error with validation errors
       if ($validator->fails()) {
           return Inertia::render('Admin/RateForm', [
               'errors' => $validator->errors()->toArray()
           ]);
       }

       if ($isUpdating) {
           $item = Rate::find($id);
           $item->update([
            'duration' => $request->input('duration'),
            'rate' => $request->input('rate'),
           ]);
       } else { 
            Rate::create([
                'duration' => $request->input('duration'),
                'rate' => $request->input('rate'),
            ]);
       }

       return to_route('admin');
   }
}
