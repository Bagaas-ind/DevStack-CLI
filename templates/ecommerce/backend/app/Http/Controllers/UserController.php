<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(User::query()->select(['id', 'name', 'email', 'role', 'created_at'])->latest()->paginate(10));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(10)],
            'role' => ['required', Rule::in(['admin', 'user'])],
        ]);
        $data['password'] = Hash::make($data['password']);
        $user = User::query()->create($data);
        return response()->json(['user' => $user->only(['id', 'name', 'email', 'role'])], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['sometimes', 'required', Rule::in(['admin', 'user'])],
            'password' => ['sometimes', 'nullable', 'confirmed', Password::min(10)],
        ]);
        if (isset($data['password']) && $data['password'] !== '') $data['password'] = Hash::make($data['password']);
        else unset($data['password']);
        if (($data['role'] ?? $user->role) !== 'admin' && $user->role === 'admin'
            && User::query()->where('role', 'admin')->count() <= 1) {
            return response()->json(['message' => 'Minimal harus ada satu administrator.'], 422);
        }
        if ($user->is($request->user()) && ($data['role'] ?? $user->role) !== 'admin') {
            return response()->json(['message' => 'Admin tidak dapat menurunkan role akun sendiri.'], 422);
        }
        $user->update($data);
        return response()->json(['user' => $user->fresh()->only(['id', 'name', 'email', 'role'])]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->is($request->user())) return response()->json(['message' => 'Akun yang sedang digunakan tidak dapat dihapus.'], 422);
        if ($user->role === 'admin' && User::query()->where('role', 'admin')->count() <= 1) {
            return response()->json(['message' => 'Minimal harus ada satu administrator.'], 422);
        }
        $user->delete();
        return response()->json(['message' => 'Pengguna berhasil dihapus.']);
    }
}
