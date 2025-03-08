<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeneralSetting extends Model
{
    protected $fillable = [
        'overtime_charge',
    ];

    protected $casts = [
        'overtime_charge' => 'decimal:2',
    ];
}
