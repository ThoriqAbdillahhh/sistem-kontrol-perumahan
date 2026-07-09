<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $units = Unit::orderBy('nama_unit')->get();

        // Status material (Aman/Boros) per unit + progress terakhir, dari view v_monitoring_progress
        $monitoring = DB::table('v_monitoring_progress')
            ->select(
                'unit_id',
                DB::raw('MAX(progress_percent) as progress_percent'),
                DB::raw("BOOL_OR(analisa = 'WASTE') as has_waste")
            )
            ->groupBy('unit_id')
            ->get()
            ->keyBy('unit_id');

        $rows = $units->map(function ($unit) use ($monitoring) {
            $m = $monitoring->get($unit->id);
            $progress = $m ? (float) $m->progress_percent : 0;

            $statusMaterial = $progress >= 100
                ? 'Selesai'
                : (($m && $m->has_waste) ? 'Boros' : 'Aman');

            return [
                'id' => $unit->nama_unit,
                'zona' => $unit->zona,
                'tukang' => $unit->tukang,
                'progress' => (int) round($progress),
                'status' => $unit->status,
                'statusMaterial' => $statusMaterial,
            ];
        });

        $unitAktif = $units->where('status', 'Aktif')->count();
        $unitSelesai = $rows->where('statusMaterial', 'Selesai')->count();
        $unitBoros = $rows->where('statusMaterial', 'Boros')->count();

        // Stok gudang, dari view v_stok_gudang
        $stokGudang = DB::table('v_stok_gudang')
            ->orderByDesc('sisa_stok')
            ->limit(5)
            ->get()
            ->map(fn ($s) => [
                'nama' => $s->nama_material,
                'sisaStok' => (float) $s->sisa_stok,
            ]);

        $maxStok = $stokGudang->max('sisaStok') ?: 1;
        $stokGudang = $stokGudang->map(function ($s) use ($maxStok) {
            $s['persen'] = min(100, round(($s['sisaStok'] / $maxStok) * 100));
            return $s;
        });

        // Pengeluaran bulan ini, dari log_keluar_harian (proxy sebelum modul Kas ada)
        $pengeluaranBulanIni = (float) DB::table('log_keluar_harian')
            ->whereMonth('tanggal', now()->month)
            ->whereYear('tanggal', now()->year)
            ->sum('total');

        return Inertia::render('Dashboard/Index', [
            'kpi' => [
                'unitAktif' => $unitAktif,
                'totalUnit' => $units->count(),
                'unitSelesai' => $unitSelesai,
                'unitBoros' => $unitBoros,
                'pengeluaranBulanIni' => $pengeluaranBulanIni,
            ],
            'rows' => $rows->values(),
            'stokGudang' => $stokGudang->values(),
        ]);
    }
}