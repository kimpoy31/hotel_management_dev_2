<?php

namespace App\Http\Controllers;

use App\Models\Rate;
use App\Models\Room;
use Illuminate\Http\Request;
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
        ]);
    }
}
