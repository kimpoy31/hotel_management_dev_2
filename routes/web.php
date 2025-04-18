<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\FrontdeskMiddleware;
use App\Http\Middleware\HousekeepingMiddleware;
use App\Models\GeneralSetting;
use App\Models\InventoryItem;
use App\Models\OvertimeCharge;
use App\Models\Rate;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {


    Route::get('/', function () {
        return Inertia::render('Welcome');
    })->name('dashboard');

    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::get('admin', function () {
            $employees = User::where('status', 'active')->where('username', '!=', 'admin')->get();
            $inventory_items = InventoryItem::where('status', 'active')->get();
            $rates = Rate::where('status', 'active')->get();
            $settings = GeneralSetting::find(1);

            return Inertia::render('Admin', [
                'employees' => $employees,
                'inventory_items' => $inventory_items,
                'rates' => $rates,
                'rooms' => Room::where('status', 'active')->get(),
                'overtime_charge' => $settings->overtime_charge,
            ]);
        })->name('admin');
    });


    Route::middleware(FrontdeskMiddleware::class)->group(function () {
        Route::get('frontdesk', function () {
            return Inertia::render('Frontdesk');
        })->name('frontdesk');
    });

    Route::middleware(HousekeepingMiddleware::class)->group(function () {
        Route::get('housekeeping', function () {
            return Inertia::render('Housekeeping');
        })->name('housekeeping');
    });


    Route::get('fetch-rooms', function () {
        $rooms = Room::where('status', 'active')->get();
        return $rooms->isEmpty() ? [] : $rooms;
    })->name('fetch.rooms');

    Route::get('fetch-reservations', function () {
        $reservations = Reservation::where('reservation_status', 'pending')->get();
        return $reservations->isEmpty() ? [] : $reservations;
    })->name('fetch.reservations');


    Route::patch('transactions-notified-checkout-warning-at', function (Request $request) {
        $transaction = Transaction::find($request->input('notif_id'));
        
        $transaction->update([
            'notified_checkout_warning_at' => now()
        ]);

    })->name('notification.flag.read');
    
});

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/frontdesk.php';
require __DIR__ . '/housekeeping.php';
require __DIR__ . '/channels.php';
