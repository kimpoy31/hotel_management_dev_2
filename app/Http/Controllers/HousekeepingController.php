<?php

namespace App\Http\Controllers;

use App\Events\InventoryItemStatusUpdated;
use App\Events\NotificationEvent;
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
        
        $missingItems = json_decode($request->input('missing_items'), true) ?? [];
        $damageReport = $request->input('damage_report');
        
        // Update transaction with raw values
        $transaction->update([
            'missing_items' => empty($missingItems) ? [] : array_values($missingItems),
            'damage_report' => empty($damageReport) ? null : $damageReport
        ]);
        
        // Calculate if any items are actually missing (for status determination only)
        $hasActualMissingItems = !empty(array_filter($missingItems, function($item) {
            return isset($item['quantity_to_check'], $item['quantity_checked']) && 
                   $item['quantity_to_check'] > $item['quantity_checked'];
        }));
        
        // Only update room status if:
        // 1. Items were actually checked (array not empty)
        // 2. No items are actually missing
        // 3. No damage reported
        if (!empty($missingItems) && !$hasActualMissingItems && empty($damageReport)) {
            $room->update([
                'room_status' => 'cleaning',
            ]);
        }
        
        // Build transaction log message
        $transactionMessage = '';
        
        if ($hasActualMissingItems) {
            $missingItemsList = collect($missingItems)
                ->filter(fn($item) => $item['quantity_to_check'] > $item['quantity_checked'])
                ->map(fn($item) => $item['item_name'] . ': ' . ($item['quantity_to_check'] - $item['quantity_checked']) . ' pc(s)')
                ->implode(', ');
                
            $transactionMessage = 'Missing items: ' . $missingItemsList . '. ';
        }
        
        if (!empty($damageReport)) {
            $transactionMessage .= 'Damage reported: ' . $damageReport . '. ';
        }
        
        // Add status update message only when we actually updated the status
        if (!empty($missingItems) && !$hasActualMissingItems && empty($damageReport)) {
            $transactionMessage .= 'Room status updated from "Pending Inspection" to "Cleaning".';
        }
        
        TransactionLog::create([
            'transaction_id' => $transaction->id,
            'transaction_officer' => Auth::user()->fullname,
            'transaction_type' => 'room inspection',
            'transaction_description' => $transactionMessage,
        ]);
    
        // Notification logic
        $title = 'Room Inspection Report';
        $description = '';
        
        if ($hasActualMissingItems && !empty($damageReport)) {
            $description = "⚠️ **Missing Items & Damage Reported**. Requires attention.";
        } elseif ($hasActualMissingItems) {
            $description = "⚠️ **Missing Items**. Please check inventory.";
        } elseif (!empty($damageReport)) {
            $description = "⚠️ **Damage Reported**. Maintenance required.";
        } elseif (!empty($missingItems)) {
            $description = "✅ Room {$transaction->room_number} inspection completed. No issues found.";
        } else {
            $description = "ℹ️ Room {$transaction->room_number} inspection submitted (no items checked).";
        }
        
        event(new NotificationEvent(
            recipients: ['administrator', 'housekeeper', 'frontdesk'],
            title: $title,
            description: $description,
            notif_id: $transaction->id,
            room_number: $transaction->room_number,
            is_db_driven: false,
        ));
    
        RoomStatusUpdated::dispatch('status_updated');
    }


    public function mark_clean(Request $request) 
    {
        $room = Room::find($request->input('room_id'));
        $transaction = Transaction::find($room->active_transaction); // Get before clearing
        $isAdmin = in_array('administrator', Auth::user()->roles);
    
        $room->update([
            'room_status' => 'available',
            'active_transaction' => null,
        ]);

        $room_additions = $transaction->room_additions ?? [];
        $room_inclusions = $transaction->room_inclusions ?? [];

        // Process used items for cleaning
        $all_items = array_merge($room_additions, $room_inclusions);

        foreach ($all_items as $item) {
            $inventoryItem = InventoryItem::find($item['item_id']);
            $quantity_to_update = $item['quantity'];

            if ($inventoryItem->item_type == 'room amenity') {
                $inventoryItem->update([
                    'in_use' => $inventoryItem->in_use -= $quantity_to_update,
                    'in_process' => $inventoryItem->in_process += $quantity_to_update,
                ]);
            } 
        }

        // Subtract missing items
        $missing_items = $transaction->missing_items ?? []; // Add null coalescing for safety

        foreach ($missing_items as $item) {
            $inventoryItem = InventoryItem::find($item['id'] ?? null); // Optional: handle missing 'id'
            
            // Use array access instead of object access
            $missing_item_quantity = ($item['quantity_to_check'] ?? 0) - ($item['quantity_checked'] ?? 0);
        
            if ($inventoryItem && $inventoryItem->item_type == 'room amenity') { // Check if $inventoryItem exists
                $inventoryItem->update([
                    'in_process' => $inventoryItem->in_process - $missing_item_quantity,
                    'missing' => $inventoryItem->missing + $missing_item_quantity,
                ]);
            } 
        }

        // Subtract clean items placed on the room for next use
        $room_inclusions = $room->room_inclusions;

        foreach ($room_inclusions as $item) {
            $inventoryItem = InventoryItem::find($item['item_id']);
            $quantity_to_update = $item['quantity'];

            if ($inventoryItem->item_type == 'room amenity') {
                $inventoryItem->update([
                    'available' => $inventoryItem->available -= $quantity_to_update,
                    'in_use' => $inventoryItem->in_use += $quantity_to_update,
                ]);
            } else if ($inventoryItem->item_type == 'consumable'){
                $inventoryItem->update([
                    'available' => $inventoryItem->available -= $quantity_to_update,
                    'sold' => $inventoryItem->sold += $quantity_to_update,
                ]);
            }
        }

    
        event(new NotificationEvent(
            recipients: ['administrator', 'housekeeper', 'frontdesk'],
            title: 'Room Marked as Available',
            description: "marked clean and is now available for new bookings.",
            notif_id: $transaction->id,
            room_number: $room->room_number,
            is_db_driven: false,
        ));
    
        TransactionLog::create([
            'transaction_id' => $transaction->id,
            'transaction_officer' => Auth::user()->fullname,
            'transaction_type' => 'room_availability_update',
            'transaction_description' => "Completed cleaning and marked Room {$room->room_number} as available",
        ]);

        InventoryItemStatusUpdated::dispatch('status_updated');
        RoomStatusUpdated::dispatch('status_updated');

        return to_route($isAdmin ? 'housekeeping' : 'dashboard');
    }


    public function restock (Request $request){
        $item = InventoryItem::find($request->itemId);

        $item->update([
            'available' => $item->available + $request->quantity,
            'in_process' =>  $item->in_process - $request->quantity
        ]);

        InventoryItemStatusUpdated::dispatch('status_updated');
    }
}
