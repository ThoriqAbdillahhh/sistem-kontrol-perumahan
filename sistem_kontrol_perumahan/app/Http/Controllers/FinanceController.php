<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKasKeluarRequest;
use App\Http\Requests\StoreKasMasukRequest;
use App\Models\AkunReferensi;
use App\Models\KasKeluar;
use App\Models\KasMasuk;
use App\Models\Unit;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function kasMasuk()
    {
        $akunOptions = AkunReferensi::orderBy('kode_akun')->get(['id', 'kode_akun', 'nama_akun']);
        $kasMasuk = KasMasuk::with('akun')
            ->orderByDesc('tanggal')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'tanggal' => $item->tanggal->format('Y-m-d'),
                    'akun' => $item->akun?->kode_akun . ' - ' . $item->akun?->nama_akun,
                    'nominal' => (float) $item->nominal,
                    'keterangan' => $item->keterangan,
                ];
            });

        return Inertia::render('Finance/Index', [
            'page' => 'Kas Masuk',
            'akunOptions' => $akunOptions,
            'kasMasuk' => $kasMasuk,
        ]);
    }

    public function kasKeluar()
    {
        $akunOptions = AkunReferensi::orderBy('kode_akun')->get(['id', 'kode_akun', 'nama_akun']);
        $unitOptions = Unit::orderBy('nama_unit')->get(['id', 'nama_unit']);
        $kasKeluar = KasKeluar::with(['akun', 'unit'])
            ->orderByDesc('tanggal')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'tanggal' => $item->tanggal->format('Y-m-d'),
                    'akun' => $item->akun?->kode_akun . ' - ' . $item->akun?->nama_akun,
                    'unit' => $item->unit?->nama_unit,
                    'nominal' => (float) $item->nominal,
                    'no_spj' => $item->no_spj,
                    'keterangan' => $item->keterangan,
                ];
            });

        return Inertia::render('Finance/Index', [
            'page' => 'Kas Keluar',
            'akunOptions' => $akunOptions,
            'unitOptions' => $unitOptions,
            'kasKeluar' => $kasKeluar,
        ]);
    }

    public function hppPerUnit()
    {
        return Inertia::render('Finance/Index', [
            'page' => 'HPP per Unit',
        ]);
    }

    public function logKeuangan()
    {
        return Inertia::render('Finance/Index', [
            'page' => 'Log Masuk & Keluar',
        ]);
    }

    public function spjOtomatis()
    {
        return Inertia::render('Finance/Index', [
            'page' => 'SPJ Otomatis',
        ]);
    }

    public function storeKasMasuk(StoreKasMasukRequest $request)
    {
        KasMasuk::create([
            ...$request->validated(),
            'created_by' => Auth::id(),
        ]);

        return back()->with('success', 'Kas masuk berhasil ditambahkan.');
    }

    public function storeKasKeluar(StoreKasKeluarRequest $request)
    {
        KasKeluar::create([
            ...$request->validated(),
            'created_by' => Auth::id(),
        ]);

        return back()->with('success', 'Kas keluar berhasil ditambahkan.');
    }
}
