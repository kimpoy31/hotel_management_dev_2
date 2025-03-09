<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function room_form($id = null){

        // if ($id) {
        //     $rate = Rate::find($id);
        //     return Inertia::render('Admin/RateForm', [
        //         'rate' => $rate
        //     ]);
        // }

        return Inertia::render('Admin/RoomForm'); 
    }
}
