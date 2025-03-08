<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function inventory_form($id = null){

        // if ($id) {
        //     $employee = User::find($id);
        //     return Inertia::render('Admin/EmployeeForm', [
        //         'employee' => $employee
        //     ]);
        // }

        return Inertia::render('Admin/InventoryForm'); 
    }
}
