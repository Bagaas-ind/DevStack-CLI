<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:3,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => response()->json($request->user()->only(['id', 'name', 'email', 'role'])));
    Route::post('/logout', [AuthController::class, 'logout']);

    // Endpoint admin dilindungi role check di server, bukan hanya di frontend.
    Route::middleware(function (Request $request, $next) {
        if ($request->user()?->role !== 'admin') {
            return response()->json(['message' => 'Akses khusus administrator.'], 403);
        }
        return $next($request);
    })->prefix('admin')->group(function () {
        Route::get('/dashboard', DashboardController::class);
        Route::apiResource('users', UserController::class)->except(['show']);
    });
});
