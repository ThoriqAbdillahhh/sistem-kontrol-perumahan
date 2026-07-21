<?php

namespace Database\Seeders;

use App\Models\AkunReferensi;
use Illuminate\Database\Seeder;

class AkunReferensiSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['nama_akun' => 'Termin 1', 'jenis' => 'masuk', 'kategori' => 'Modal'],
            ['nama_akun' => 'Termin 2', 'jenis' => 'masuk', 'kategori' => 'Modal'],
            ['nama_akun' => 'Penjualan Unit', 'jenis' => 'masuk', 'kategori' => 'Penjualan'],
            ['nama_akun' => 'Upah Tukang Harian', 'jenis' => 'keluar', 'kategori' => 'Operasional'],
            ['nama_akun' => 'Transportasi & BBM', 'jenis' => 'keluar', 'kategori' => 'Operasional'],
        ];

        foreach ($data as $item) {
            AkunReferensi::firstOrCreate(
                ['nama_akun' => $item['nama_akun'], 'jenis' => $item['jenis']],
                $item
            );
        }
    }
}