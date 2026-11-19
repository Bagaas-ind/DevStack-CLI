<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Kredensial demo hanya tersedia pada environment lokal/testing.
        $isLocal = app()->environment(['local', 'testing']);
        $name = config('react-lara-forge.admin.name') ?: ($isLocal ? 'Local Admin' : null);
        $email = config('react-lara-forge.admin.email') ?: ($isLocal ? 'admin@example.com' : null);
        $password = config('react-lara-forge.admin.password') ?: ($isLocal ? 'password' : null);

        if (! $name || ! $email || ! $password) {
            throw new RuntimeException(
                'Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before seeding an administrator outside local/testing.'
            );
        }

        if (strlen($password) < 12 && ! $isLocal) {
            throw new RuntimeException('ADMIN_PASSWORD must contain at least 12 characters outside local/testing.');
        }

        $admin = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
            ]
        );

        if ($admin->role !== 'admin') {
            $admin->forceFill(['role' => 'admin'])->save();
        }
    }
}
