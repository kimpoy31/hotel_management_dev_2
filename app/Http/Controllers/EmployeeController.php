<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function employee_form($id = null){

        if ($id) {
            $employee = User::find($id);
            return Inertia::render('Admin/EmployeeForm', [
                'employee' => $employee
            ]);
        }

        return Inertia::render('Admin/EmployeeForm'); 
    }

    public function employee_form_submit(Request $request, $id = null){         // Validate incoming data
         // Determine if we're updating or creating
        $isUpdating = $id !== null;

        // Validation rules
        $validator = Validator::make($request->all(), [
            'fullname' => ['required', 'string'],
            'username' => [
                'required', 'string',
                $isUpdating 
                    ? Rule::unique('users', 'username')->ignore($id) 
                    : 'unique:users,username'
            ],
            'roles' => ['required', 'array'],
        ]);

        // If validation fails, return a 422 error with validation errors
        if ($validator->fails()) {
            return Inertia::render('Admin/EmployeeForm', [
                'errors' => $validator->errors()->toArray()
            ]);
        }

        if ($isUpdating) {
            $employee = User::find($id);
            $employee->update([
                'fullname' => $request->input('fullname'),
                'username' => $request->input('username'),
                'roles' => $request->input('roles'),
            ]);
        } else {
        $employee = User::create([
            'fullname' => $request->input('fullname'),
            'username' => $request->input('username'),
            'roles' => $request->input('roles'),
            'password' => Hash::make('1234'),
        ]);
        }

        return to_route('admin');
    }
}
