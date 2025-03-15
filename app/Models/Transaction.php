<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'transaction_officer',
        'check_in',
        'check_out',
        'expected_check_out',
        'number_of_hours',
        'number_of_days',
        'stay_extension',
        'rate',
        'room_number',
        'customer_name',
        'customer_address',
        'customer_contact_number',
        'id_picture_path',
        'room_additions',
        'total_payment',
        'missing_items',
        'damaged_items',
        'settlement_payment',
        'overtime_charge',
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'expected_check_out' => 'datetime',
        'stay_extension' => 'array',
        'room_additions' => 'array',
        'missing_items' => 'array',
        'rate' => 'decimal:2',
        'total_payment' => 'decimal:2',
        'settlement_payment' => 'decimal:2',
        'overtime_charge' => 'decimal:2',
    ];
}
