<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\InventoryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    
    Route::get('admin/employee/{id?}', [EmployeeController::class, 'employee_form'])
        ->name('employee.form');

    Route::post('admin/employee/{id?}', [EmployeeController::class, 'employee_form_submit'])
        ->name('employee.form.submit');


    Route::get('admin/inventory/{id?}', [InventoryController::class, 'inventory_form'])
    ->name('inventory.form');
});
