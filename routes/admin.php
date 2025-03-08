<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\RateController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    
    // EMPLOYEE MANAGER
    Route::get('admin/employee/{id?}', [EmployeeController::class, 'employee_form'])
        ->name('employee.form');

    Route::post('admin/employee/{id?}', [EmployeeController::class, 'employee_form_submit'])
        ->name('employee.form.submit');

    // INVENTORY MANAGER
    Route::get('admin/inventory/{id?}', [InventoryController::class, 'inventory_form'])
    ->name('inventory.form');

    Route::post('admin/inventory/{id?}', [InventoryController::class, 'inventory_form_submit'])
    ->name('inventory.form.submit');

    // RATE MANAGER
    Route::get('admin/rate/{id?}', [RateController::class, 'rate_form'])
    ->name('rate.form');

    Route::post('admin/rate/{id?}', [RateController::class, 'rate_form_submit'])
    ->name('rate.form.submit');
});
