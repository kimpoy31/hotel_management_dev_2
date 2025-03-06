<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['username' => 'admin'], // Condition to check if the user exists
            [
                'fullname' => 'user admin',
                'roles' => json_encode(['administrator']),
                'password' => Hash::make('admin'),
            ]
        );
    }
}
