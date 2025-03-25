<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FrontdeskController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('frontdesk/room/{id}', [FrontdeskController::class, 'room_form'])
        ->name('frontdesk.room.form');

    Route::patch('frontdesk/room-additions/{id}', [FrontdeskController::class, 'update_room_additions'])
    ->name('update.room.additions');
    
    Route::patch('frontdesk/upgrade-rate/{id}', [FrontdeskController::class, 'upgrade_rate_availed'])
    ->name('upgrade.rate.availed');

    Route::post('frontdesk/room/check-in', [FrontdeskController::class, 'check_in'])
        ->name('frontdesk.check_in');
});
