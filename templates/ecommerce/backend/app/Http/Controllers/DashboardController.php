<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'total_users' => User::query()->count(),
            'total_admins' => User::query()->where('role', 'admin')->count(),
            'total_regular_users' => User::query()->where('role', 'user')->count(),
        ]);
    }
}
