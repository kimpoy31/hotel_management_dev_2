<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\Room;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HousekeepingController extends Controller
{
    public function room_form($id) {
        $room = Room::find($id);
        $transaction = Transaction::find($room->active_transaction);
    
        // Merge inclusions and additions
        $inclusions = $room->room_inclusions ?? [];
        $additions = $transaction->room_additions ?? [];
        
        // Combine and sum quantities for matching items
        $combinedItems = collect([...$inclusions, ...$additions])
            ->groupBy('item_id')
            ->map(function ($items) {
                return [
                    'item_id' => $items->first()['item_id'],
                    'type' => $items->first()['type'],
                    'quantity_to_check' => $items->sum('quantity')
                ];
            })
            ->values()
            ->all();
    
        // Get all room amenity items from inventory and filter
        $inventoryItems = InventoryItem::where('item_type', 'room amenity')
            ->get()
            ->map(function ($item) use ($combinedItems) {
                $matchedItem = collect($combinedItems)->firstWhere('item_id', $item->id);
                $item->quantity_to_check = $matchedItem['quantity_to_check'] ?? 0;
                return $item;
            })
            ->filter(function ($item) {
                return $item->quantity_to_check > 0;  // Only keep items with quantity > 0
            })
            ->values();  // Reset array keys after filtering
    
        return Inertia::render('Housekeeping/Room', [
            'room' => $room,
            'items_to_check' => $inventoryItems
        ]);
    }
}
