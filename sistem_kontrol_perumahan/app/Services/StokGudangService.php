<?php

namespace App\Services;

use App\Models\Material;
use App\Models\LogMasukGudang;
use App\Models\LogKeluarHarian;

class StokGudangService
{
    public function stokSemuaMaterial()
    {
        return Material::query()
            ->select('materials.*')
            ->selectSub(
                LogMasukGudang::whereColumn('material_id', 'materials.id')
                    ->selectRaw('COALESCE(SUM(qty), 0)'),
                'total_masuk'
            )
            ->selectSub(
                LogKeluarHarian::whereColumn('material_id', 'materials.id')
                    ->selectRaw('COALESCE(SUM(qty), 0)'),
                'total_keluar'
            )
            ->get()
            ->map(function ($m) {
                $m->stok_saat_ini = $m->total_masuk - $m->total_keluar;
                return $m;
            });
    }

    public function stokMaterial(int $materialId): float
    {
        $masuk = LogMasukGudang::where('material_id', $materialId)->sum('qty');
        $keluar = LogKeluarHarian::where('material_id', $materialId)->sum('qty');

        return $masuk - $keluar;
    }

    public function ringkasanDashboard()
    {
        return $this->stokSemuaMaterial()->map(function ($m) {
            $persen = $m->total_masuk > 0
                ? round(($m->stok_saat_ini / $m->total_masuk) * 100)
                : 0;

            return [
                'nama'     => $m->nama_material,
                'sisaStok' => $m->stok_saat_ini,
                'persen'   => max(0, min(100, $persen)),
            ];
        })->values();
    }
}