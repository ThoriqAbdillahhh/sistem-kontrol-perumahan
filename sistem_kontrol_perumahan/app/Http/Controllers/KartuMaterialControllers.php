<?php

namespace App\Http\Controllers;

use App\Models\LogKeluar;
use App\Models\Unit;
use Inertia\Inertia;
use Inertia\Response;

class KartuMaterialUnitController extends Controller
{
    /**
     * Daftar material yang direkap di Kartu Material per Unit.
     * Urutan array ini menentukan urutan kolom di tabel.
     *
     * SESUAIKAN: kalau proyek Anda sudah punya tabel Master Material,
     * ganti dua properti ini dengan query, misalnya:
     *   $materialList   = Material::orderBy('urutan')->pluck('nama')->all();
     *   $materialSatuan = Material::pluck('satuan', 'nama')->all();
     */
    private array $materialList = [
        'Semen', 'Pasir Pasang', 'Pasir Cor', 'Bata Bolong', 'Split',
        'Besi 6', 'Besi 8', 'Paku 3', 'Paku 4', 'Kaso', 'Reng', 'Genteng',
    ];

    private array $materialSatuan = [
        'Semen' => 'Zak', 'Pasir Pasang' => 'Rit', 'Pasir Cor' => 'Rit',
        'Bata Bolong' => 'Bh', 'Split' => 'Rit', 'Besi 6' => 'Btg',
        'Besi 8' => 'Btg', 'Paku 3' => 'Kg', 'Paku 4' => 'Kg',
        'Kaso' => 'Btg', 'Reng' => 'Btg', 'Genteng' => 'Bh',
    ];

    /**
     * Menampilkan halaman "Kartu Material per Unit".
     * Read-only: hasil rekap otomatis dari log keluar gudang per unit.
     *
     * SESUAIKAN nama kolom di bawah ('kode_unit', 'nama_material', 'qty', dst.)
     * kalau nama kolom di tabel Anda berbeda.
     */
    public function index(): Response
    {
        $units = Unit::orderBy('kode_unit')->get();

        // Total pemakaian per unit per material, dihitung langsung di database.
        $pemakaian = LogKeluar::selectRaw('unit_id, nama_material, SUM(qty) as total_qty')
            ->groupBy('unit_id', 'nama_material')
            ->get()
            ->groupBy('unit_id');

        $rows = $units->map(function (Unit $unit) use ($pemakaian) {
            $usage = [];
            foreach ($pemakaian->get($unit->id, collect()) as $log) {
                $usage[$log->nama_material] = (float) $log->total_qty;
            }

            return [
                'id' => $unit->kode_unit,
                'zona' => $unit->zona,
                'progress' => (int) $unit->progress,
                'usage' => $usage,
            ];
        })->values();

        return Inertia::render('Keuangan/KartuMaterialUnit', [
            'units' => $rows,
            'materialList' => $this->materialList,
            'materialSatuan' => $this->materialSatuan,
        ]);
    }
}
