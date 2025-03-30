<?php

use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::post('room/reserve-room', [ReservationController::class, 'reserve_room'])
    ->name('reserve.room');
    
  
});
