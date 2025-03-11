<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontdeskController extends Controller
{
    public function room_form ($id){
        return Inertia::render('Frontdesk/Room', [
            'room' => Room::find($id),
        ]);
    }
}
