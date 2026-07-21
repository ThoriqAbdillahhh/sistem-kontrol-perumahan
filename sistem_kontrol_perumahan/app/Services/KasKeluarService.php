<?php

namespace App\Services;

use App\Models\KasKeluar;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class KasKeluarService
{
    public function create(array $data, ?UploadedFile $lampiran = null): KasKeluar
    {
        return DB::transaction(function () use ($data, $lampiran) {
            $qty = (float) $data['qty'];
            $nominalPerUnit = (float) $data['nominal_per_unit'];

            $lampiranPath = null;
            if ($lampiran) {
                // disimpan di storage/app/public/lampiran-kas-keluar
                $lampiranPath = $lampiran->store('lampiran-kas-keluar', 'public');
            }

            return KasKeluar::create([
                'tanggal' => $data['tanggal'],
                'akun_referensi_id' => $data['akun_referensi_id'],
                'unit' => $data['unit'] ?? null,
                'keterangan' => $data['keterangan'] ?? null,
                'qty' => $qty,
                'satuan' => $data['satuan'] ?? null,
                'nominal_per_unit' => $nominalPerUnit,
                'total' => $qty * $nominalPerUnit,
                'metode_bayar' => $data['metode_bayar'],
                'penerima' => $data['penerima'] ?? null,
                'lampiran_path' => $lampiranPath,
                'created_by' => Auth::id(),
            ]);
        });
    }
}