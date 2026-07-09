<?php

namespace App\Services;

use App\Models\Material;

class StokGudangService
{
    public static function summary()
    {
        return Material::query()
            ->select(['id', 'kode_material as kode', 'nama_material as nama', 'satuan', 'harga'])
            ->withSum('logMasuk as total_masuk', 'qty')
            ->withSum('logKeluar as total_keluar', 'qty')
            ->get()
            ->map(function (Material $m) {
                $totalMasuk  = (float) ($m->total_masuk ?? 0);
                $totalKeluar = (float) ($m->total_keluar ?? 0);
                $sisa        = $totalMasuk - $totalKeluar;

                return [
                    'material_id'  => $m->id,
                    'kode'         => $m->kode,
                    'nama'         => $m->nama,
                    'satuan'       => $m->satuan,
                    'total_masuk'  => $totalMasuk,
                    'total_keluar' => $totalKeluar,
                    'sisa_stok'    => $sisa,
                    'nilai_rupiah' => $sisa * (float) $m->harga,
                    'is_warning'   => $sisa < 0,
                ];
            })
            ->values();
    }
}