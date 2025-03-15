<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FrontdeskController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('frontdesk/room/{id}', [FrontdeskController::class, 'room_form'])
        ->name('frontdesk.room.form');


    Route::post('frontdesk/room/check-in', [FrontdeskController::class, 'check_in'])
        ->name('frontdesk.check_in');
});
