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
            'name' => 'Operator User',
            'email' => 'operator@example.com',
            'role' => 'operator',
            'password' => bcrypt('password123'),
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Mover User',
            'email' => 'mover@example.com',
            'role' => 'mover',
            'password' => bcrypt('password123'),
        ]);
    }
}
