<?php

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
    
    $rooms = Room::where('status','active')->whereNotNull('active_transaction')->get();

    foreach($rooms as $room){

        $transaction = Transaction::find($room->active_transaction);

        // Parse the expected checkout time to Asia/Manila timezone
        $expected_checkout = Carbon::parse($transaction->expected_check_out)
        ->timezone('Asia/Manila')
        ->format('Y-m-d H:i:s');

        // Get current time + 30 minutes in Asia/Manila
        $current_plus_30 = Carbon::now('Asia/Manila')->addMinutes(30)->format('Y-m-d H:i:s');

        if ($current_plus_30 >= $expected_checkout) {
            // ✅ Execute your logic here if current time + 30 mins is >= expected checkout
            // Replace this with your actual logic
        } else {
            continue;
        }
    }

})
    ->everyMinute()
    ->timezone('Asia/Manila');