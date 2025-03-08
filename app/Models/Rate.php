<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rate extends Model
{
    protected $fillable = [
        'duration',
        'rate',
        'status',
    ];

    protected $casts = [
        'duration' => 'integer',
        'rate' => 'decimal:2',
    ];
}
