<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'transaction_officer',
        'check_in',
        'check_out',
        'expected_check_out',
        'number_of_hours',
        'rate',
        'room_number',
        'customer_name',
        'customer_address',
        'customer_contact_number',
        'id_picture_path',
        'room_inclusions',
        'room_additions',
        'total_payment',
        'missing_items',
        'damage_report',
        'settlement_payment',
        'overtime_charge',
        'latest_rate_availed_id',
        'notified_checkout_warning_at'
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'expected_check_out' => 'datetime',
        'room_additions' => 'array',
        'missing_items' => 'array',
        'rate' => 'decimal:2',
        'total_payment' => 'decimal:2',
        'settlement_payment' => 'decimal:2',
        'overtime_charge' => 'decimal:2',
        'latest_rate_availed_id' => 'integer',
    ];

    protected $appends = ['transaction_logs']; // Append to JSON response

    protected function transactionLogs(): Attribute
    {
        return Attribute::make(
            get: fn() => TransactionLog::where('transaction_id', $this->id)->get(),
        );
    }
}
