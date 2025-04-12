<?php

namespace App\Http\Controllers;

use App\Events\RoomStatusUpdated;
use App\Models\GeneralSetting;
use App\Models\InventoryItem;
use App\Models\Rate;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Transaction;
use App\Models\TransactionLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FrontdeskController extends Controller
{
    public function room_form($id)
    {
        $room = Room::find($id);

        return Inertia::render('Frontdesk/Room', [
            'room' => $room,
            'rates' => Rate::where('status', 'active')
                ->whereIn('id', $room->room_rate_ids ?? []) // ✅ Ensure it's an array or default to an empty array
                ->get(), // ✅ Add get() to execute the query
            'inventory_items' => InventoryItem::where('status', 'active')->get()->toArray(),
            'active_transaction' => Transaction::find($room->active_transaction) ?? null,
        ]);
    }

    public function room_reserve_form($id = null)
    {
        $reservation = $id ? Reservation::find($id) : null;
        $reserved_room = $reservation ? Room::find($reservation->reserved_room_id) : null;
    
        return Inertia::render('Frontdesk/RoomReservationForm', [
            'rooms' => Room::where('status', 'active')->get(),
            'inventory_items' => InventoryItem::where('status', 'active')->get(),
            'rates' => Rate::where('status', 'active')->get(),
            'reservations' => Reservation::where('reservation_status', 'pending')
                ->when($reservation, fn($query) => $query->where('id', '!=', $reservation->id))
                ->get(),
            'reservation' => $reservation, // Will be null if not found
            'reserved_room' => $reserved_room, // Will be null if no reservation exists
        ]);
    }
    
    
    public function check_in(Request $request)
    {
        // Validation rules
        $validator = Validator::make($request->all(), [
            'rate_id' => ['required', 'integer'],
            'room_id' => ['required', 'integer'],
            'number_of_hours' => ['required', 'integer'],
            'rate' => ['required', 'numeric', 'min:0.01'],
            'room_number' => ['required', 'string'],
            'customer_name' => ['required', 'string'],
            'customer_address' => ['required', 'string'],
            'id_picture' => ['nullable', 'file', 'max:2048', 'mimes:jpg,jpeg,png'], // 2048 KB = 2 MB
            'total_payment' => ['required', 'numeric', 'min:0.01'],
        ]);

        // If validation fails, return a 422 error with validation errors
        if ($validator->fails()) {
            return to_route('frontdesk.room.form', $request->room_id)->withErrors($validator);
        }

        $room = Room::find($request->input('room_id'));

        // * HANDLE ROOM ADDITIONS -> subtract additions from inventory -> available
        $room_additions = json_decode($request->input('room_additions'), true) ?? [];

        foreach ($room_additions as $item) {
            $inventoryItem = InventoryItem::find($item['item_id']);
            $quantity_to_update = $item['quantity'];

            if ($inventoryItem->item_type == 'room amenity') {
                $inventoryItem->update([
                    'available' => $inventoryItem->available -= $quantity_to_update,
                    'in_use' => $inventoryItem->in_use += $quantity_to_update,
                ]);
            } else if ($inventoryItem->item_type == 'consumable') {
                $inventoryItem->update([
                    'available' => $inventoryItem->available -= $quantity_to_update,
                    'sold' => $inventoryItem->sold += $quantity_to_update,
                ]);
            }
        }

        // * SAVE IF ID PICTURE IS PROVIDED
        if ($request->hasFile('id_picture') && $request->file('id_picture')->isValid()) {
            $idPicturePath = Storage::disk('public')->putFile('id_pictures', $request->file('id_picture'));
        }

        // GENERAL SETTINGS
        $generalSettings = GeneralSetting::find(1);

        $check_in_time = now();
        $expected_check_out = now()->addHours((int) $request->input('number_of_hours'));
        
        if ((int) $request->input('number_of_hours') >= 24) {
            // Convert to PH timezone first
            $expected_check_out = $expected_check_out->timezone('Asia/Manila')->setTime(12, 0, 0);
        
            // Convert back to UTC for storage
            $expected_check_out = $expected_check_out->timezone('UTC');
        }        

        $transaction = Transaction::create([
            'transaction_officer' => Auth::user()->fullname,
            'check_in' => $check_in_time,
            'expected_check_out' => $expected_check_out,
            'number_of_hours' => $request->input('number_of_hours'),
            'latest_rate_availed_id' => $request->input('latest_rate_availed_id'),
            'rate' => $request->input('rate'),
            'room_number' => $request->input('room_number'),
            'customer_name' => $request->input('customer_name'),
            'customer_address' => $request->input('customer_address'),
            'customer_contact_number' => $request->input('customer_contact_number'),
            'id_picture_path' => $idPicturePath ?? null,
            'room_additions' => json_decode($request->input('room_additions'), true),
            'total_payment' => $request->input('total_payment'),
            'overtime_charge' => $generalSettings->overtime_charge,
        ]);

        $checkIn = Carbon::parse($transaction->check_in)->timezone('Asia/Manila')->format('F j, Y h:i A');
        $checkOut = Carbon::parse($transaction->expected_check_out)->timezone('Asia/Manila')->format('F j, Y h:i A');

        $transaction_message = 'Checked in to Room ' . $transaction->room_number . '. Check-in: ' . $checkIn . '. Expected Checkout: ' . $checkOut . '.';

        if (!empty($transaction->room_additions)) {
            $additions = collect($transaction->room_additions)
                ->map(fn($item) => $item['name'] . ': ' . $item['quantity'] . ' pc(s)')
                ->implode(', ');

            $transaction_message .= ' Room additions: ' . $additions . '.';
        }

        $transaction_message .= ' Transaction payment: ₱' . $transaction->total_payment;

        TransactionLog::create([
            'transaction_id' => $transaction->id,
            'transaction_officer' => Auth::user()->fullname,
            'transaction_type' => 'check-in',
            'transaction_description' => $transaction_message,
        ]);

        $room->update([
            'active_transaction' => $transaction->id,
            'room_status' => 'occupied'
        ]);

        RoomStatusUpdated::dispatch('status_updated');
    }

    public function update_room_additions(Request $request, $id)
    {
        // * HANDLE ROOM ADDITIONS -> subtract additions from inventory -> available
        $room = Room::find($id);
        $transaction = Transaction::find($room->active_transaction);

        // Transaction item additions
        if ($transaction) {
            $roomAdditions = $transaction->room_additions;
            $new_room_additions = json_decode($request->input('new_room_additions'), true) ?? [];

            foreach ($new_room_additions as $newItem) {
                $existingItemIndex = array_search($newItem['item_id'], array_column($roomAdditions, 'item_id'));

                if ($existingItemIndex !== false) {
                    // If item exists, increment the quantity
                    $roomAdditions[$existingItemIndex]['quantity'] += $newItem['quantity'];
                } else {
                    // If item doesn't exist, add it to the array
                    $roomAdditions[] = $newItem;
                }
            }

            // Save updated room_additions back to the transaction
            $transaction->update([
                'room_additions' => $roomAdditions,
                'total_payment' =>  $transaction->total_payment += $request->input('total_payment'),
            ]);
        }

        $transaction_message = '';

        if (!empty($transaction->room_additions)) {
            $additions = collect($transaction->room_additions)
                ->map(fn($item) => $item['name'] . ': ' . $item['quantity'] . ' pc(s)')
                ->implode(', ');

            $transaction_message .= 'Room additions: ' . $additions . '.';
        }

        $transaction_message .= ' Transaction payment: ₱' . $request->input('total_payment');

        TransactionLog::create([
            'transaction_id' => $transaction->id,
            'transaction_officer' => Auth::user()->fullname,
            'transaction_type' => 'room addition',
            'transaction_description' => $transaction_message,
        ]);

        // UPDATE INVENTORY ITEMS
        foreach ($new_room_additions as $new_item) {
            $inventoryItem = InventoryItem::find($new_item['item_id']);
            $quantity_to_update = $new_item['quantity'];

            if ($inventoryItem->item_type == 'room amenity') {
                $inventoryItem->update([
                    'available' => $inventoryItem->available -= $quantity_to_update,
                    'in_use' => $inventoryItem->in_use += $quantity_to_update,
                ]);
            } else if ($inventoryItem->item_type == 'consumable') {
                $inventoryItem->update([
                    'available' => $inventoryItem->available -= $quantity_to_update,
                    'sold' => $inventoryItem->sold += $quantity_to_update,
                ]);
            }
        }

        return to_route('frontdesk.room.form', $id);
    }

    // REUSABLE FUNCTION
    public function formatTransactionDuration(int $numberOfHours): string
    {
        $days = floor($numberOfHours / 24);
        $hours = $numberOfHours % 24;

        if ($days > 0 && $hours > 0) {
            return "{$days} " . ($days > 1 ? "Days" : "Day") . " & {$hours} " . ($hours > 1 ? "Hours" : "Hour");
        } elseif ($days > 0) {
            return "{$days} " . ($days > 1 ? "Days" : "Day");
        } elseif ($hours > 0) {
            return "{$hours} " . ($hours > 1 ? "Hours" : "Hour");
        }

        return "0 Hours";
    }

    public function extend_stay_duration(Request $request)
    {
        $transaction = Transaction::find($request->input('transaction_id'));       

        $expectedCheckOut = Carbon::parse($transaction->expected_check_out)
        ->addHours((int) $request->input('number_of_hours'));

        if ((int) $request->input('number_of_hours') >= 24) {
            // Convert to PH timezone first
            $expectedCheckOut = $expectedCheckOut->timezone('Asia/Manila')->setTime(12, 0, 0);
        
            // Convert back to UTC for storage
            $expectedCheckOut = $expectedCheckOut->timezone('UTC');
        }    

        $transaction_message = 'Extended stay duration. ' . $this->formatTransactionDuration($transaction->number_of_hours) . ' + ' . $this->formatTransactionDuration($request->input('number_of_hours'));
        $transaction_message .= '. Transaction payment: ₱' . $request->input('total_amount_to_add');
        $transaction_message .= '. Previous expected checkout: ' . Carbon::parse($transaction->expected_check_out)->setTimezone('Asia/Manila')->format('F j, Y g:i A');
        $transaction_message .= '. Updated expected checkout: ' . Carbon::parse($expectedCheckOut)->setTimezone('Asia/Manila')->format('F j, Y g:i A');

        $transaction->update([
            'expected_check_out' => $expectedCheckOut,
            'latest_rate_availed_id' => $request->input('latest_rate_availed_id'),
            'number_of_hours' => $transaction->number_of_hours + $request->input('number_of_hours'),
            'total_payment' =>  $transaction->total_payment + $request->input('total_amount_to_add'),
        ]);

        TransactionLog::create([
            'transaction_id' => $transaction->id,
            'transaction_officer' => Auth::user()->fullname,
            'transaction_type' => 'extend',
            'transaction_description' => $transaction_message,
        ]);

        RoomStatusUpdated::dispatch('status_updated');
    }

    public function upgrade_rate_availed(Request $request)
    {
        $transaction = Transaction::find($request->input('transaction_id'));
        $upgradeRateAvailed = Rate::find($request->input('latest_rate_availed_id'));
        
        $expectedCheckOut = Carbon::parse($transaction->expected_check_out)
        ->addHours((int) $request->input('number_of_hours'));

        if ($upgradeRateAvailed->duration >= 24) {
            // Convert to PH timezone first
            $expectedCheckOut = $expectedCheckOut->timezone('Asia/Manila')->setTime(12, 0, 0);
        
            // Convert back to UTC for storage
            $expectedCheckOut = $expectedCheckOut->timezone('UTC');
        }    
 
        $prevRateAvailed = Rate::find($transaction->latest_rate_availed_id);
        $transaction_message = 'Duration upgraded from ' . $this->formatTransactionDuration($prevRateAvailed->duration) . ' to ' . $this->formatTransactionDuration(
            (int) $upgradeRateAvailed->duration * (int) $request->input('number_of_days')
        );
        $transaction_message .= '. Previous expected checkout: ' . Carbon::parse($transaction->expected_check_out)->setTimezone('Asia/Manila')->format('F j, Y g:i A');
        $transaction_message .= '. Updated expected checkout: ' . Carbon::parse($expectedCheckOut)->setTimezone('Asia/Manila')->format('F j, Y g:i A');
        $transaction_message .= '. Transaction payment: ₱' . $request->input('total_amount_to_add');

        $transaction->update([
            'expected_check_out' => $expectedCheckOut,
            'latest_rate_availed_id' => $request->input('latest_rate_availed_id'),
            'number_of_hours' => $transaction->number_of_hours + $request->input('number_of_hours'),
            'total_payment' =>  $transaction->total_payment + $request->input('total_amount_to_add'),
        ]);

        TransactionLog::create([
            'transaction_id' => $transaction->id,
            'transaction_officer' => Auth::user()->fullname,
            'transaction_type' => 'upgrade',
            'transaction_description' => $transaction_message,
        ]);

        RoomStatusUpdated::dispatch('status_updated');
    }
 
    public function check_out (Request $request) {
        $overtime_charge = $request->input('overtime_charge');
        $pending_payment = $request->input('pending_payment');
        $transaction = Transaction::find($request->input('transaction_id'));
        $room = Room::find($request->input('room_id'));

        $transaction->update([
            'pending_payments' => $transaction->pending_payments - $pending_payment,
            'overtime_charge' => $overtime_charge,
            'total_payment' => $transaction->total_payment + $overtime_charge + $pending_payment,
            'check_out' => now(),
        ]);

        $room->update(['room_status' => 'pending_inspection']);

        $transaction_message = 'Room status changed from "Occupied" to "Pending Inspection". Date: ' . $transaction->check_out . '. Collected overtime charge amount: ₱' . $overtime_charge ;
        $transaction_message .= '. Collected pending payment: ₱' . $pending_payment ;

        TransactionLog::create([
            'transaction_id' => $transaction->id,
            'transaction_officer' => Auth::user()->fullname,
            'transaction_type' => 'checkout',
            'transaction_description' => $transaction_message,
        ]);

        RoomStatusUpdated::dispatch('status_updated');
    }
}
