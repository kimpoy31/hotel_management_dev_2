<?php

namespace Database\Seeders;

use App\Models\OvertimeCharge;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OvertimeChargeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('general_settings')->updateOrInsert(
            ['id' => 1], // Check if record with ID 1 exists
            [
                'overtime_charge' => 0.00,   // Set default value
                'status' => 'active',        // Set default status
            ]
        );
    }
}
