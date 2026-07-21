<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKasKeluarRequest;
use App\Models\AkunReferensi;
use App\Models\KasKeluar;
use App\Services\KasKeluarService;
use Inertia\Inertia;

class KasKeluarController extends Controller
{
    public function __construct(protected KasKeluarService $service) {}

    public function index()
    {
        $kasKeluar = KasKeluar::with('akunReferensi')
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->get()
            ->map(fn ($item) => [
                ...$item->toArray(),
                'lampiran_url' => $item->lampiran_path ? asset('storage/' . $item->lampiran_path) : null,
            ]);

        return Inertia::render('Finance/KasKeluar', [
            'kasKeluar' => $kasKeluar,
            'akunOptions' => AkunReferensi::keluar()->get(['id', 'nama_akun']),
        ]);
    }

    public function store(StoreKasKeluarRequest $request)
    {
        $this->service->create($request->validated(), $request->file('lampiran'));

        return redirect()->back()->with('success', 'Kas keluar berhasil dicatat.');
    }
}