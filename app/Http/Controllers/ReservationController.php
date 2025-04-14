<?php

namespace App\Http\Controllers;

use App\Events\ReservedRoomStatusUpdated;
use App\Models\Rate;
use App\Models\Reservation;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function reserve_room(Request $request)
    {
        $reservationId = $request->input('reservation_id');
       
        // If reservationId exists, find the reservation; otherwise, create a new instance
        $reservation = Reservation::find($reservationId) ?? new Reservation();

        // Parse the frontend's PHT datetime and convert to UTC for storage
        $checkInDatetime = Carbon::parse(
            $request->input('check_in_datetime'), 
            'Asia/Manila'
        )->utc();
        
        $expectedCheckoutDateTime = $checkInDatetime->copy()->addHours(
            (int) $request->input('number_of_hours')
        );

        // Fill in the reservation details
        $reservation->fill([
            'reserved_room_id' => $request->input('reserved_room_id'),
            'room_additions' => json_decode($request->input('room_additions'), true),
            'rate_availed_id' => $request->input('rate_availed_id'),
            'check_in_datetime' => $checkInDatetime,
            'expected_check_out' => $expectedCheckoutDateTime,
            'number_of_hours' => $request->input('number_of_hours'),
            'number_of_days' => $request->input('number_of_days'),
            'guest_name' => $request->input('guest_name'),
            'guest_address' => $request->input('guest_address'),
            'guest_contact_number' => $request->input('guest_contact_number'),
            'total_payment' => $request->input('total_payment'),
            'pending_payment' => $request->input('pending_payment'),
            'transaction_officer' => Auth::user()->fullname,
        ]);

        // Save the reservation (either create or update)
        $reservation->save();

        ReservedRoomStatusUpdated::dispatch('status_updated');

        $isAdmin = in_array('administrator', Auth::user()->roles);

        return to_route($isAdmin ? 'frontdesk' : 'dashboard');
    }
}
