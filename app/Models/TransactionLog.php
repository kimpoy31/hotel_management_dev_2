<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionLog extends Model
{
    protected $fillable = [
        'transaction_id',
        'transaction_officer',
        'transaction_type',
        'transaction_description',
        'status'
    ];
}
