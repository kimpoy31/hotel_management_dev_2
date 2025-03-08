<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function employee_form(){
        return Inertia::render('Admin/EmployeeForm'); 
    }
}
