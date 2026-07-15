<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Models\MatrixProgress;
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

        // ── Bangun cumulative standar qty per material, per batas_atas ──
        $matrixSorted = MatrixProgress::with('details')->orderBy('batas_atas')->get();

        $running = [];              // material_id => running total qty_standar
        $cumulativeByBatasAtas = []; // batas_atas => snapshot [material_id => total]

        foreach ($matrixSorted as $m) {
            foreach ($m->details as $d) {
                $running[$d->material_id] = ($running[$d->material_id] ?? 0) + (float) $d->qty_standar;
            }
            $cumulativeByBatasAtas[$m->batas_atas] = $running;
        }

        $batasAtasList = $matrixSorted->pluck('batas_atas')->sort()->values();

        // ── Aktual qty terpakai per unit per material ──
        $aktualByUnit = LogKeluarHarian::selectRaw('unit_id, material_id, SUM(qty) as total_qty')
            ->groupBy('unit_id', 'material_id')
            ->get()
            ->groupBy('unit_id');

        // ── Hitung status material per unit ──
        $computeStatusMaterial = function (Unit $u) use ($cumulativeByBatasAtas, $batasAtasList, $aktualByUnit) {
            $progress = (float) ($u->latestProgress?->progress_percent ?? 0);

            if ($progress >= 100) {
                return 'Selesai';
            }

            if ($cumulativeByBatasAtas === []) {
                return 'Aman'; // belum ada data matrix sama sekali
            }

            // Cari tahap saat ini: batas_atas terkecil yang >= progress
            $currentBatasAtas = $batasAtasList->first(fn ($b) => $b >= $progress) ?? $batasAtasList->last();

            $standarMap = $cumulativeByBatasAtas[$currentBatasAtas] ?? [];

            if ($standarMap === []) {
                return 'Aman';
            }

            $aktualMap = ($aktualByUnit[$u->id] ?? collect())
                ->keyBy('material_id');

            $maxRatio = 0;
            foreach ($standarMap as $materialId => $standarQty) {
                if ($standarQty <= 0) {
                    continue;
                }
                $aktualQty = (float) ($aktualMap[$materialId]->total_qty ?? 0);
                $ratio = ($aktualQty / $standarQty) * 100;
                $maxRatio = max($maxRatio, $ratio);
            }

            if ($maxRatio > 120) {
                return 'Boros';
            }
            if ($maxRatio > 100) {
                return 'Warning';
            }
            return 'Aman';
        };

        $rows = $units->map(function ($u) use ($computeStatusMaterial) {
            $progress = (int) ($u->latestProgress?->progress_percent ?? 0);

            return [
                'id'             => $u->nama_unit,
                'zona'           => $u->zona,
                'tukang'         => $u->tukang,
                'progress'       => $progress,
                'status'         => $u->status,
                'statusMaterial' => $computeStatusMaterial($u),
            ];
        });

        $totalUnit   = $units->count();
        $unitAktif   = $units->where('status', 'Aktif')->count();
        $unitDiinput = $units->filter(fn ($u) => $u->latestProgress !== null)->count();
        $unitSelesai = $rows->where('statusMaterial', 'Selesai')->count();
        $unitWarning = $rows->where('statusMaterial', 'Warning')->count();
        $unitBoros   = $rows->where('statusMaterial', 'Boros')->count();

        return Inertia::render('Dashboard/Index', [
            'kpi' => [
                'totalUnit'           => $totalUnit,
                'unitDiinput'         => $unitDiinput,
                'unitAktif'           => $unitAktif,
                'unitSelesai'         => $unitSelesai,
                'unitWarning'         => $unitWarning,
                'unitBoros'           => $unitBoros,
                'pengeluaranBulanIni' => (float) $pengeluaranBulanIni,
            ],
            'rows'       => $rows,
            'stokGudang' => $this->stokService->ringkasanDashboard(),
        ]);
    }
}