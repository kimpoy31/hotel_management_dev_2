<?php

use App\Http\Controllers\FrontdeskController;
use App\Http\Controllers\ReservationController;
use App\Http\Middleware\FrontdeskMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', FrontdeskMiddleware::class])->group(function () {
    Route::get('frontdesk/room/{id}', [FrontdeskController::class, 'room_form'])
        ->name('frontdesk.room.form');

    Route::patch('frontdesk/room-additions/{id}', [FrontdeskController::class, 'update_room_additions'])
        ->name('update.room.additions');

    Route::patch('frontdesk/upgrade-rate/{id}', [FrontdeskController::class, 'upgrade_rate_availed'])
        ->name('upgrade.rate.availed');

    Route::patch('frontdesk/extend-duration', [FrontdeskController::class, 'extend_stay_duration'])
        ->name('extend.stay.duration');

    Route::patch('frontdesk/room/check-out', [FrontdeskController::class, 'check_out'])
        ->name('frontdesk.checkout');

    Route::post('frontdesk/room/check-in', [FrontdeskController::class, 'check_in'])
        ->name('frontdesk.check_in');

    Route::get('frontdesk/reserve-room/{id?}', [FrontdeskController::class, 'room_reserve_form'])
        ->name('frontdesk.room.reserve.form');

    Route::patch('frontdesk/room/settlement', [FrontdeskController::class, 'room_settlement'])
    ->name('frontdesk.settlement');


    // RESERVATION ROUTES
    Route::post('room/reserve-room', [ReservationController::class, 'reserve_room'])
    ->name('reserve.room');
});
