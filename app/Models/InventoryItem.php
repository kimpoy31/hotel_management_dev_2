<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    // Allow mass assignment for these fields
    protected $fillable = [
        'item_name',
        'item_type',
        'available',
        'in_use',
        'in_process',
        'sold',
        'missing',
        'price',
        'status',
    ];

    // Define type casting for fields
    protected $casts = [
        'available' => 'integer',
        'in_use' => 'integer',
        'in_process' => 'integer',
        'sold' => 'integer',
        'missing' => 'integer',
        'price' => 'decimal:2',
    ];
}
