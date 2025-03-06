<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function login_form()
    {
        return Inertia::render('Login');
    }



    public function login(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt([
            'username' => $request->username,
            'password' => $request->password,
        ], $request->remember)) {
            // Check if the user's status is inactive
            if (Auth::user()->status === 'inactive') {
                // Log the user out if the status is inactive
                Auth::logout();

                // Redirect back to the login page with an error message
                return Inertia::render('Login', [
                    'error' => 'Your account is inactive. Please contact support.',
                ]);
            }

            return to_route('dashboard');
        }

        return Inertia::render('Login', [
            'error' => 'Provided password / username is incorrect',
        ]);
    }


    public function logout(Request $request)
    {
        Auth::logout(); // Log the user out
        $request->session()->invalidate(); // Invalidate the session
        $request->session()->regenerateToken(); // Regenerate CSRF token for security

        return to_route('login'); // Redirect to the login page after logout
    }
}
