<?php

use App\Http\Controllers\HousekeepingController;
use App\Http\Middleware\HousekeepingMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', HousekeepingMiddleware::class])->group(function () {
    Route::get('housekeeping/room/{id}', [HousekeepingController::class, 'room_form'])
        ->name('housekeeping.room.form');

    Route::patch('housekeeping/room/submit-inspection', [HousekeepingController::class, 'submit_inspection'])
        ->name('housekeeping.submit.inspection');

    Route::patch('housekeeping/room/mark-clean', [HousekeepingController::class, 'mark_clean'])
        ->name('housekeeping.mark.clean');

     Route::patch('housekeeping/restock', [HousekeepingController::class, 'restock'])
        ->name('housekeeping.restock');
});
