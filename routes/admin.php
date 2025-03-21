<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\GeneralSettingController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\RateController;
use App\Http\Controllers\RoomController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', AdminMiddleware::class])->group(function () {

    // EMPLOYEE MANAGER
    Route::get('admin/employee/{id?}', [EmployeeController::class, 'employee_form'])
        ->name('employee.form');
    Route::post('admin/employee/{id?}', [EmployeeController::class, 'employee_form_submit'])
        ->name('employee.form.submit');
    Route::patch('admin/employee/{id}', [EmployeeController::class, 'employee_delete'])
        ->name('employee.delete');




    // ROOM MANAGER
    Route::get('admin/room/{id?}', [RoomController::class, 'room_form'])
        ->name('room.form');
    Route::post('admin/room/{id?}', [RoomController::class, 'room_form_submit'])
        ->name('room.form.submit');
    Route::patch('admin/room/{id}', [RoomController::class, 'room_delete'])
        ->name('room.delete');




    // INVENTORY MANAGER
    Route::get('admin/inventory/{id?}', [InventoryController::class, 'inventory_form'])
        ->name('inventory.form');
    Route::post('admin/inventory/{id?}', [InventoryController::class, 'inventory_form_submit'])
        ->name('inventory.form.submit');
    Route::patch('admin/inventory/{id}', [InventoryController::class, 'item_delete'])
        ->name('item.delete');




    // RATE MANAGER
    Route::get('admin/rate/{id?}', [RateController::class, 'rate_form'])
        ->name('rate.form');
    Route::post('admin/rate/{id?}', [RateController::class, 'rate_form_submit'])
        ->name('rate.form.submit');
    Route::patch('admin/rate/{id}', [RateController::class, 'rate_delete'])
        ->name('rate.delete');




        
    // GENERAL SETTINGS
    Route::patch('admin/overtime_charge', [GeneralSettingController::class, 'overtime_charge_patch'])
        ->name('overtime_charge.patch');
});
