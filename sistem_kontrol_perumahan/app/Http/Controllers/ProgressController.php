<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProgressUnitRequest;
use App\Models\ProgressUnit;
use App\Models\Unit;
use App\Traits\LogsActivity;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Services\MaterialConsumptionService;

class ProgressController extends Controller
{
    use LogsActivity;

    public function __construct(protected MaterialConsumptionService $consumptionService)
    {
    }

    public function index()
    {
        $units = Unit::with([
            'latestProgress',
            'progress' => fn ($q) => $q->with('updatedBy')->orderByDesc('tanggal_update')->orderByDesc('id'),
        ])->orderBy('nama_unit')->get();

        $monitoring = $units->mapWithKeys(function (Unit $unit) {
            $detail = $unit->latestProgress?->detail_material ?? [];

            $rows = collect($detail)->map(fn ($d) => [
                'nama_material' => $d['material'],
                'standar'       => $d['qty_standar'],
                'aktual'        => $d['qty_aktual'],
                'sisa'          => $d['sisa'] ?? ($d['qty_aktual'] - $d['qty_standar']),
                'analisa'       => strtoupper($d['status']),
            ])->all();

            return [$unit->id => $rows];
        });

        return Inertia::render('Progress/Index', [
            'units'      => $units,
            'monitoring' => $monitoring,
        ]);
    }

public function store(StoreProgressUnitRequest $request)
    {
        $unit = Unit::findOrFail($request->validated('unit_id'));
        $hasil = $this->consumptionService->evaluasiUnit($unit, (float) $request->validated('progress_percent'));

        DB::transaction(function () use ($request, $unit, $hasil) {
            $progress = ProgressUnit::create([
                ...$request->validated(),
                'updated_by'       => Auth::id(),
                'status_material'  => strtoupper($hasil['status']),
                'detail_material'  => $hasil['detail'],
            ]);

            if ($unit->status !== 'Aktif') {
                $unit->update(['status' => 'Aktif']);
            }

            $this->notifikasiJikaBermasalah($unit, $hasil, $progress);
        });

        return back()->with('success', 'Progress unit berhasil diperbarui.');
    }

    private function notifikasiJikaBermasalah(Unit $unit, array $hasil, ProgressUnit $progress): void
    {
        $status = strtoupper($hasil['status']);

        if ($status !== 'WARNING' && $status !== 'BOROS') {
            return;
        }

        // Ambil nama-nama material yang statusnya bukan Aman, buat isi deskripsi
        $materialBermasalah = collect($hasil['detail'])
            ->filter(fn ($d) => strtoupper($d['status']) !== 'AMAN')
            ->pluck('material')
            ->implode(', ');

        $this->logActivity(
            module: 'progress',
            action: strtolower($status), // 'warning' atau 'boros', dipakai NotificationIcon di frontend
            description: "Unit {$unit->nama_unit}: pemakaian material {$status} pada {$materialBermasalah}",
            subject: $progress,
        );
    }
}