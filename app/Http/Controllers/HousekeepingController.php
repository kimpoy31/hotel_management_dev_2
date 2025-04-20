<?php

namespace App\Http\Controllers;

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
        
        $rawMissingItems = json_decode($request->input('missing_items'), true) ?? [];
        $damageReport = $request->input('damage_report');
        
        // Filter to only include genuinely missing items
        $missingItems = array_filter($rawMissingItems, function($item) {
            return isset($item['quantity_to_check'], $item['quantity_checked']) && 
                   $item['quantity_to_check'] > $item['quantity_checked'];
        });
        
        // Update transaction with clean values
        $transaction->update([
            'missing_items' => empty($missingItems) ? [] : array_values($missingItems), // Always array
            'damage_report' => empty($damageReport) ? null : $damageReport // Null if empty
        ]);
        
        // Only update room status to 'cleaning' if no missing items and no damage report
        if (empty($missingItems) && empty($damageReport)) {
            $room->update([
                'room_status' => 'cleaning',
            ]);
        }
        
        // Build transaction log message
        $transactionMessage = '';
        
        if (!empty($missingItems)) {
            $missingItemsList = collect($missingItems)
                ->map(fn($item) => $item['item_name'] . ': ' . ($item['quantity_to_check'] - $item['quantity_checked']) . ' pc(s)')
                ->implode(', ');
                
            $transactionMessage = 'Missing items: ' . $missingItemsList . '. ';
        }
        
        if (!empty($damageReport)) {
            $transactionMessage .= 'Damage reported: ' . $damageReport . '. ';
        }
        
        // Only add the default status update message if no issues were found
        if (count($missingItems) === 0 && empty($damageReport)) {
            $transactionMessage .= 'Room status updated from "Pending Inspection" to "Cleaning".';
        }
        
        TransactionLog::create([
            'transaction_id' => $transaction->id,
            'transaction_officer' => Auth::user()->fullname,
            'transaction_type' => 'room inspection',
            'transaction_description' => $transactionMessage,
        ]);
    
        RoomStatusUpdated::dispatch('status_updated');
    
        // Notification logic (same as before)
        $hasMissingItems = !empty($missingItems);
        $hasDamageReport = !empty($damageReport);
    
        $title = 'Room Inspection Report';
        $description = '';
    
        if ($hasMissingItems && $hasDamageReport) {
            $description = "⚠️ **Missing Items & Damage Reported**. Requires attention.";
        } elseif ($hasMissingItems) {
            $description = "⚠️ **Missing Items**. Please check inventory.";
        } elseif ($hasDamageReport) {
            $description = "⚠️ **Damage Reported**. Maintenance required.";
        } else {
            $description = "✅ Room {$transaction->room_number} inspection completed. No issues found.";
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

        RoomStatusUpdated::dispatch('status_updated');

        return to_route($isAdmin ? 'housekeeping' : 'dashboard');
    }
}
