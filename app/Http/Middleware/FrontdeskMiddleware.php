<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class FrontdeskMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Check if user is authenticated and has the 'administrator' role
        if ($user && in_array('administrator', $user->roles) || in_array('frontdesk', $user->roles)) {
            return $next($request);
        }

        // Redirect back if not authorized
        return to_route('dashboard');  // Fixed this line
    }
}
