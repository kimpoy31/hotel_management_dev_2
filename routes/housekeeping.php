<?php

use App\Http\Middleware\HousekeepingMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', HousekeepingMiddleware::class])->group(function () {
    // Route::get('frontdesk/room/{id}', [FrontdeskController::class, 'room_form'])
    //     ->name('frontdesk.room.form');

    // Route::patch('frontdesk/room-additions/{id}', [FrontdeskController::class, 'update_room_additions'])
    //     ->name('update.room.additions');

    // Route::patch('frontdesk/upgrade-rate/{id}', [FrontdeskController::class, 'upgrade_rate_availed'])
    //     ->name('upgrade.rate.availed');

    // Route::patch('frontdesk/extend-duration', [FrontdeskController::class, 'extend_stay_duration'])
    //     ->name('extend.stay.duration');

    // Route::patch('frontdesk/room/check-out', [FrontdeskController::class, 'check_out'])
    //     ->name('frontdesk.checkout');

    // Route::post('frontdesk/room/check-in', [FrontdeskController::class, 'check_in'])
    //     ->name('frontdesk.check_in');

    // Route::get('frontdesk/reserve-room/{id?}', [FrontdeskController::class, 'room_reserve_form'])
    //     ->name('frontdesk.room.reserve.form');



    // // RESERVATION ROUTES
    // Route::post('room/reserve-room', [ReservationController::class, 'reserve_room'])
    // ->name('reserve.room');
});
