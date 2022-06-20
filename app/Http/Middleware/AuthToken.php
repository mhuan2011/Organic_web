<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (isset($_COOKIE["name"]) && isset($_COOKIE["token"])) {
            $name = isset($_COOKIE["name"]);
            $token = isset($_COOKIE["token"]);
            if ($token) {
                return $next($request);
            }
        }
        echo '<h1>This is middleware</h1>';
        return redirect('admin/login');
    }
}
