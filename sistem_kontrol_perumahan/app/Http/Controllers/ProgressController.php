<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProgressUnitRequest;
use App\Models\ProgressUnit;
use App\Models\Unit;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Services\MaterialConsumptionService;

class ProgressController extends Controller
{
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
            ProgressUnit::create([
                ...$request->validated(),
                'updated_by'       => Auth::id(),
                'status_material'  => strtoupper($hasil['status']),
                'detail_material'  => $hasil['detail'],
            ]);

            // Begitu ada input progress, unit otomatis dianggap Aktif —
            // hanya diubah kalau statusnya sekarang bukan sudah Aktif,
            // supaya tidak menimpa status lain (misal Selesai) tanpa alasan.
            if ($unit->status !== 'Aktif') {
                $unit->update(['status' => 'Aktif']);
            }
        });

        return back()->with('success', 'Progress unit berhasil diperbarui.');
    }
}