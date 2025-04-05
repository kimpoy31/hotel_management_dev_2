<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'login_form'])
        ->name('login');


    Route::post('login', [AuthController::class, 'login'])
        ->name('login.post');

    Route::patch('login', [AuthController::class, 'admin_reset_password'])
        ->name('admin.reset.password');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])
        ->name('logout');
});
