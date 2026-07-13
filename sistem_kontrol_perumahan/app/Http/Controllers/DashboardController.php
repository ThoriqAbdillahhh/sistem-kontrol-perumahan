<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Models\LogKeluarHarian;
use App\Services\StokGudangService;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __construct(protected StokGudangService $stokService) {}

    public function index()
    {
        $bulanIni = Carbon::now();

        $pengeluaranBulanIni = LogKeluarHarian::whereMonth('tanggal', $bulanIni->month)
            ->whereYear('tanggal', $bulanIni->year)
            ->sum('total');

        $units = Unit::with('latestProgress')->get();

        $totalUnit   = $units->count();
        $unitAktif   = $units->where('status', 'Aktif')->count();
        $unitSelesai = $units->filter(fn ($u) => ($u->latestProgress?->progress_percent ?? 0) == 100)->count();
        $unitBoros   = $units->filter(fn ($u) => $u->latestProgress?->status === 'Boros')->count();

        $rows = $units->map(function ($u) {
            $progress = $u->latestProgress?->progress_percent ?? 0;

            // Selesai punya prioritas tampilan di atas status boros/aman
            $statusMaterial = $progress == 100
                ? 'Selesai'
                : ($u->latestProgress?->status ?? 'Aman');

            return [
                'id'             => $u->nama_unit,
                'zona'           => $u->zona,
                'tukang'         => $u->tukang,
                'progress'       => (int) $progress,
                'status'         => $u->status,
                'statusMaterial' => $statusMaterial,
            ];
        });

        return Inertia::render('Dashboard/Index', [
            'kpi' => [
                'unitAktif'           => $unitAktif,
                'totalUnit'           => $totalUnit,
                'unitSelesai'         => $unitSelesai,
                'unitBoros'           => $unitBoros,
                'pengeluaranBulanIni' => (float) $pengeluaranBulanIni,
            ],
            'rows'       => $rows,
            'stokGudang' => $this->stokService->ringkasanDashboard(),
        ]);
    }
}