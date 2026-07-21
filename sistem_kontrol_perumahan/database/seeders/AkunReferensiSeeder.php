<?php

namespace Database\Seeders;

use App\Models\AkunReferensi;
use Illuminate\Database\Seeder;

class AkunReferensiSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['kode_akun' => '001', 'nama_akun' => 'Termin 1', 'jenis' => 'masuk', 'kategori' => 'HPP'],
            ['kode_akun' => '002', 'nama_akun' => 'Termin 2', 'jenis' => 'masuk', 'kategori' => 'HPP'],
            ['kode_akun' => '003', 'nama_akun' => 'Penjualan Unit', 'jenis' => 'masuk', 'kategori' => 'HPP'],
            ['kode_akun' => '101', 'nama_akun' => 'Upah Tukang Harian', 'jenis' => 'keluar', 'kategori' => 'Operasional'],
            ['kode_akun' => '102', 'nama_akun' => 'Transportasi & BBM', 'jenis' => 'keluar', 'kategori' => 'Operasional'],
            ['kode_akun' => '103', 'nama_akun' => 'Biaya Administrasi', 'jenis' => 'keluar', 'kategori' => 'Operasional'],
        ];

        foreach ($data as $item) {
            AkunReferensi::firstOrCreate(
                ['kode_akun' => $item['kode_akun']],
                $item
            );
        }
    }
}