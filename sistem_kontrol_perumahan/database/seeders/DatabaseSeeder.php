<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['nama_unit' => 'A-01', 'zona' => 'A', 'status' => 'Belum Dibangun'],
            ['nama_unit' => 'A-02', 'zona' => 'A', 'status' => 'Belum Dibangun'],
            ['nama_unit' => 'B-01', 'zona' => 'B', 'status' => 'Belum Dibangun'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(['nama_unit' => $unit['nama_unit']], $unit);
        }
    }
}