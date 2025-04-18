<?php

namespace App\Http\Controllers;

use App\Events\RoomStatusUpdated;
use App\Models\InventoryItem;
use App\Models\Room;
use App\Models\Transaction;
use App\Models\TransactionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
                $item->quantity_checked = 0; // Add default checked quantity
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



    public function submit_inspection(Request $request) {
        $room = Room::find($request->input('room_id'));
        $transaction = Transaction::find($request->input('transaction_id'));
        
        $missingItems = json_decode($request->input('missing_items'), true);
        
        // Update records
        $transaction->update([
            'missing_items' => $missingItems,
            'damage_report' => $request->input('damage_report')
        ]);
        
        $room->update([
            'room_status' => 'cleaning',
        ]);
        
        // Create transaction log for missing items
        $transactionMessage = '';
        
        if (!empty($missingItems)) {
            $missingItemsList = collect($missingItems)
                ->map(fn($item) => $item['item_name'] . ': ' . ($item['quantity_to_check'] - $item['quantity_checked']) . ' pc(s)')
                ->implode(', ');
                
            $transactionMessage = 'Missing items: ' . $missingItemsList . '. ';
        }
        
        $transactionMessage .= 'Room status updated from "Pending Inspection" to "Cleaning".';
        
        TransactionLog::create([
            'transaction_id' => $transaction->id,
            'transaction_officer' => Auth::user()->fullname,
            'transaction_type' => 'room inspection',
            'transaction_description' => $transactionMessage,
        ]);

        RoomStatusUpdated::dispatch('status_updated');
    }
}
