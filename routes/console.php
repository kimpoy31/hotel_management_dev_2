<?php

use App\Events\NotificationEvent;
use App\Models\Room;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Foundation\Console\ClosureCommand;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

    Schedule::command('check-reservations')
    ->everyMinute()
    ->timezone('Asia/Manila');
    
    Schedule::call(function () {
        // Get all active rooms with their transactions in a single query
        $rooms = Room::where('status', 'active')
                     ->where('room_status', 'occupied')
                     ->whereNotNull('active_transaction')
                     ->get();
    
        // Preload transactions in one query (avoid N+1)
        $transactionIds = $rooms->pluck('active_transaction')->filter()->unique();
        $transactions = Transaction::whereIn('id', $transactionIds)
                                  ->get()
                                  ->keyBy('id'); // For O(1) lookup

        $now = Carbon::now('Asia/Manila');

        foreach ($rooms as $room) {
            $transaction = $transactions[$room->active_transaction] ?? null;
    
            if (!$transaction) {
                continue; // Skip if transaction is missing
            }

            $formattedExpectedCheckout = Carbon::parse($transaction->expected_check_out)->timezone('Asia/Manila')->format('F j, Y h:i A');
            $expectedCheckout = Carbon::parse($transaction->expected_check_out)->timezone('Asia/Manila');
            $cutoffTime = $now->copy()->addMinutes(30);
    
            if ($cutoffTime->greaterThanOrEqualTo($expectedCheckout) && 
                is_null($transaction->notified_checkout_warning_at)) {
                event(new NotificationEvent(
                    recipients: ['administrator', 'housekeeper','frontdesk'],
                    title: 'Checkout Warning',
                    description: "due for checkout at {$formattedExpectedCheckout}",
                    notif_id: $transaction->id,
                    room_number: $transaction->room_number,
                    is_db_driven: true,
                ));
            }
        }
    })
    ->everyMinute()
    ->timezone('Asia/Manila');