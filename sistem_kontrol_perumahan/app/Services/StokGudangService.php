<?php
namespace App\Services;

use App\Models\Material;
use App\Models\LogMasukGudang;
use App\Models\LogKeluarHarian;
    class StokGudangService
    {
        return Material::query()
            ->with('latestLogMasuk')
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
                $sisaStok = (float) $m->total_masuk - (float) $m->total_keluar;
                $hargaTerakhir = (float) ($m->latestLogMasuk->harga_satuan ?? 0);

                return [
                    'material_id'  => $m->id,
                    'kode'         => $m->kode_material,
                    'nama'         => $m->nama_material,
                    'satuan'       => $m->satuan,
                    'total_masuk'  => (float) $m->total_masuk,
                    'total_keluar' => (float) $m->total_keluar,
                    'sisa_stok'    => $sisaStok,
                    'harga_satuan' => $hargaTerakhir,
                    'nilai_rupiah' => $sisaStok * $hargaTerakhir,
                    'is_warning'   => $sisaStok <= 0,
                ];
            })
            ->values();
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
            $persen = $m['total_masuk'] > 0
                ? round(($m['sisa_stok'] / $m['total_masuk']) * 100)
                : 0;

            return [
                'nama'     => $m['nama'],
                'sisaStok' => $m['sisa_stok'],
                'persen'   => max(0, min(100, $persen)),
            ];
        })->values();
    }
}