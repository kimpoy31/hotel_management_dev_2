<?php

use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('admin/employee', [EmployeeController::class, 'employee_form'])
        ->name('employee.form');
});
