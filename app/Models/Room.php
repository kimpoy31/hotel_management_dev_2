<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'room_number',
        'room_type',
        'room_rate_ids',
        'room_inclusions',
        'room_status',
        'active_transaction',
        'status',
    ];

    protected $casts = [
        'room_rates' => 'array',
        'room_rate_ids' => 'array',
        'room_inclusions' => 'array',
    ];

     protected $appends = ['room_rates','room_inclusion_items']; // Append to JSON response

    protected function roomRates(): Attribute
    {
        return Attribute::make(
            get: fn() => Rate::whereIn('id',$this->room_rate_ids)->get(),
        );
    }

    protected function roomInclusionItems(): Attribute
    {
        return Attribute::make(
            get: function () {
                 // Fetch room inclusions from JSON as array
            $inclusions = $this->room_inclusions ?? [];

            // Extract item_ids from inclusions
            $itemIds = array_column($inclusions, 'item_id');

            // Fetch items from InventoryItem model based on item_ids
            $items = InventoryItem::whereIn('id', $itemIds)->get();

            return $items;
            }
        );
    }
}
