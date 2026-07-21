<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKasMasukRequest;
use App\Models\AkunReferensi;
use App\Models\KasMasuk;
use App\Services\KasMasukService;
use Inertia\Inertia;

class KasMasukController extends Controller
{
    public function __construct(protected KasMasukService $service) {}

    public function index()
    {
        $kasMasuk = KasMasuk::with('akunReferensi')
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->get();

        $totalBulanIni = KasMasuk::whereMonth('tanggal', now()->month)
            ->whereYear('tanggal', now()->year)
            ->sum('nominal');

        return Inertia::render('finance/KasMasuk', [
            'kasMasuk' => $kasMasuk,
            'totalBulanIni' => $totalBulanIni,
            'akunOptions' => AkunReferensi::masuk()->get(['id', 'nama_akun']),
        ]);
    }

    public function store(StoreKasMasukRequest $request)
    {
        $this->service->create($request->validated());

        return redirect()->back()->with('success', 'Kas masuk berhasil dicatat.');
    }
}