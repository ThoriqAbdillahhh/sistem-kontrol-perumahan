<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Models\MatrixProgress;
use App\Models\LogKeluarHarian;
use App\Models\LogMasukGudang;
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

        $penerimaanBulanIni = LogMasukGudang::whereMonth('tanggal', $bulanIni->month)
            ->whereYear('tanggal', $bulanIni->year)
            ->sum('total_harga');

        $saldoBulanIni = $penerimaanBulanIni - $pengeluaranBulanIni;

        $currentWeekStart = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $currentWeekEnd = Carbon::now()->endOfWeek(Carbon::MONDAY);
        $periodeMinggu = sprintf(
            '%s - %s %s',
            $currentWeekStart->translatedFormat('d M'),
            $currentWeekEnd->translatedFormat('d M'),
            $currentWeekEnd->year,
        );

        $startOfMonth = $bulanIni->copy()->startOfMonth();
        $endOfMonth = $bulanIni->copy()->endOfMonth();

        $masukPerWeek = LogMasukGudang::whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->get(['tanggal', 'total_harga'])
            ->groupBy(function ($item) {
                return Carbon::parse($item->tanggal)
                    ->startOfWeek(Carbon::MONDAY)
                    ->format('Y-m-d');
            })
            ->map(function ($items) {
                return $items->sum(fn ($item) => (float) $item->total_harga);
            })
            ->toArray();

        $keluarPerWeek = LogKeluarHarian::whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->get(['tanggal', 'total'])
            ->groupBy(function ($item) {
                return Carbon::parse($item->tanggal)
                    ->startOfWeek(Carbon::MONDAY)
                    ->format('Y-m-d');
            })
            ->map(function ($items) {
                return $items->sum(fn ($item) => (float) $item->total);
            })
            ->toArray();

        $weekKeys = collect(array_keys($masukPerWeek))
            ->merge(array_keys($keluarPerWeek))
            ->unique()
            ->sort()
            ->values()
            ->all();

        $cashflowWeekly = array_map(function ($weekStart) use ($masukPerWeek, $keluarPerWeek) {
            $start = Carbon::parse($weekStart);
            $end = $start->copy()->endOfWeek(Carbon::MONDAY);
            $masuk = $masukPerWeek[$weekStart] ?? 0;
            $keluar = $keluarPerWeek[$weekStart] ?? 0;

            return [
                'weekLabel' => sprintf(
                    'Minggu %s (%s - %s)',
                    $start->weekOfYear,
                    $start->translatedFormat('d M'),
                    $end->translatedFormat('d M'),
                ),
                'masuk' => $masuk,
                'keluar' => $keluar,
                'saldo' => $masuk - $keluar,
            ];
        }, $weekKeys);

        $topPengeluaran = LogKeluarHarian::query()
            ->selectRaw('material_id, SUM(total) as total_pengeluaran')
            ->with('material')
            ->groupBy('material_id')
            ->orderByDesc('total_pengeluaran')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'nama' => $item->material?->nama ?? 'Tidak diketahui',
                    'total' => (float) $item->total_pengeluaran,
                ];
            })
            ->all();

        $units = Unit::with(['latestProgress',])->get();

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

        $monitoring = $units->mapWithKeys(function (Unit $unit) {

            $detail = $unit->latestProgress?->detail_material ?? [];

            $rows = collect($detail)->map(fn ($d) => [
                'nama_material' => $d['material'],
                'standar'       => $d['qty_standar'],
                'aktual'        => $d['qty_aktual'],
                'analisa'       => strtoupper($d['status']),
            ])->all();

            return [$unit->id => $rows];
        });

        $rows = $units->map(function ($u) use ($computeStatusMaterial) {
            $progress = (int) ($u->latestProgress?->progress_percent ?? 0);

            return [
                'id' => $u->id,
                'nama_unit' => $u->nama_unit,
                'zona' => $u->zona,
                'tukang' => $u->tukang,
                'progress' => $progress,
                'status' => $u->status,
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
                'penerimaanBulanIni'  => (float) $penerimaanBulanIni,
                'saldoBulanIni'       => (float) $saldoBulanIni,
                'totalModalMasuk'     => (float) $penerimaanBulanIni,
                'totalPengeluaran'    => (float) $pengeluaranBulanIni,
                'saldoKas'            => (float) $saldoBulanIni,
                'nilaiMaterialMasuk'  => (float) $penerimaanBulanIni,
                'periodeMinggu'       => $periodeMinggu,
            ],
            'rows'           => $rows,
            'monitoring'     => $monitoring,
            'cashflowWeekly' => $cashflowWeekly,
            'topPengeluaran' => $topPengeluaran,
            // provide full stok data so the frontend can sort by harga or stok
            'stokGudang'     => $this->stokService->getStokGudang(),
        ]);
    }
}