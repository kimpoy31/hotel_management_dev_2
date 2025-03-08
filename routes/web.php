<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {


    Route::get('/', function () {
        return Inertia::render('Welcome');
    })->name('dashboard');


    Route::get('admin', function () {
        $employees = User::where('status','active')->where('username','!=','admin')->get();

        return Inertia::render('Admin',[
            'employees'=>$employees
        ]);
        
    })->name('admin');


    
});

require __DIR__ . '/auth.php';
require __DIR__ . '/employee.php';
