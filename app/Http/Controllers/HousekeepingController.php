<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HousekeepingController extends Controller
{
    public function room_form ($id){
        return Inertia::render('Housekeeping/Room',[
            'room' => Room::find($id),
        ]);
    }
}
