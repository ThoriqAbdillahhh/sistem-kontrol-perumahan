<?php

namespace App\Services;

use App\Models\KasMasuk;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class KasMasukService
{
    public function create(array $data): KasMasuk
    {
        return DB::transaction(function () use ($data) {
            $tanggal = Carbon::parse($data['tanggal']);

            return KasMasuk::create([
                'tanggal' => $tanggal,
                'akun_referensi_id' => $data['akun_referensi_id'],
                'keterangan' => $data['keterangan'] ?? null,
                'nominal' => $data['nominal'],
                'dari' => $data['dari'],
                'untuk' => $data['untuk'] ?? 'Kas Proyek EstateControl',
                'minggu_ke' => (int) $tanggal->format('W'),
                'created_by' => Auth::id(),
            ]);
        });
    }
}