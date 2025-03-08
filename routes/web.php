<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {


    Route::get('/', function () {
        return Inertia::render('Welcome');
    })->name('dashboard');


    Route::get('admin', function () {
        return Inertia::render('Admin');
    })->name('admin');


    
});

require __DIR__ . '/auth.php';
require __DIR__ . '/employee.php';
