<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // create operator and mover
        \App\Models\User::factory()->create([
            'name' => env('OPERATOR_NAME', 'Operator User'),
            'email' => env('OPERATOR_MAIL', 'operator@example.com'),
            'role' => 'operator',
            'password' => bcrypt('password123'),
        ]);

        \App\Models\User::factory()->create([
            'name' => env('MOVER_NAME', 'Mover User'),
            'email' => env('MOVER_MAIL', 'mover@example.com'),
            'role' => 'mover',
            'password' => bcrypt(env('PASSWORD', 'password')),
        ]);
    }
}
