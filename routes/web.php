<?php

use App\Models\InventoryItem;
use App\Models\Rate;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {


    Route::get('/', function () {
        return Inertia::render('Welcome');
    })->name('dashboard');


    Route::get('admin', function () {
        $employees = User::where('status','active')->where('username','!=','admin')->get();
        $inventory_items = InventoryItem::where('status','active')->get();
        $rates = Rate::where('status','active')->get();

        return Inertia::render('Admin',[
            'employees'=>$employees,
            'inventory_items'=>$inventory_items,
            'rates'=>$rates,
        ]);
        
    })->name('admin');


    
});

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
