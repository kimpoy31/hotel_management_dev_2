<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $table = 'reservations';

    protected $fillable = [
        'reserved_room_id',
        'room_additions',
        'rate_availed_id',
        'check_in_datetime',
        'expected_check_out',
        'number_of_hours',
        'number_of_days',
        'guest_name',
        'guest_address',
        'guest_contact_number',
        'total_payment',
        'pending_payment',
        'transaction_officer',
        'reservation_status'
    ];

    protected $casts = [
        'room_additions' => 'array',
        'check_in_datetime' => 'datetime:Y-m-d\TH:i',
        'expected_check_out' => 'datetime',
        'total_payment' => 'decimal:2',
        'pending_payment' => 'decimal:2',
    ];
}
