<?php

namespace App\Http\Controllers;

use App\Models\Rate;
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

        $rates = Rate::where('status','active')->get();

        return Inertia::render('Admin/RoomForm', [
            'rates' => $rates,
        ]); 
    }
}
