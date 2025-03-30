<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function reserve_room (Request $request){
        $room = Room::find($request->input('reserved_room_id'));

        $reservation = Reservation::create([
            'reserved_room_id' => $request->input('reserved_room_id'),
            'room_additions' => json_decode($request->input('room_additions'),true),
            'rate_availed_id' => $request->input('rate_availed_id'),
            'check_in_datetime' => $request->input('check_in_datetime'),
            'expected_check_out' => $request->input('expected_check_out'),
            'number_of_hours' => $request->input('number_of_hours'),
            'number_of_days' => $request->input('number_of_days'),
            'guest_name' => $request->input('guest_name'),
            'guest_address' => $request->input('guest_address'),
            'guest_contact_number' => $request->input('guest_contact_number'),
            'total_payment' => $request->input('total_payment'),
            'pending_payment' => $request->input('pending_payment'),
            'transaction_officer' => Auth::user()->fullname,
        ]);


        // Get the existing room_reservation_ids or initialize an empty array
        $reservationIds = $room->room_reservation_ids ?? [];
        // Append the new reservation ID
        $reservationIds[] = $reservation->id;

        // Update the room with the new array
        $room->update([
            'room_reservation_ids' => $reservationIds,
        ]);

        return to_route('frontdesk');
    }
}
