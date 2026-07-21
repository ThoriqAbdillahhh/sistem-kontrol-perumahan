<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\KasKeluar;
use App\Models\Unit;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HppController extends Controller
{
    public function index()
    {
        $materialCosts = DB::table('log_keluar_harian')
            ->select('unit_id', DB::raw('COALESCE(SUM(total), 0) as total_material'))
            ->groupBy('unit_id')
            ->pluck('total_material', 'unit_id');

        $cashCosts = KasKeluar::query()
            ->with('akunReferensi')
            ->whereNotNull('unit')
            ->select('id', 'unit', 'total', 'akun_referensi_id')
            ->get()
            ->groupBy('unit')
            ->map(function ($items) {
                $totalUpah = $items->sum(fn ($item) => $item->akunReferensi?->kategori === 'HPP' ? (float) $item->total : 0);
                $totalOperasional = $items->sum(fn ($item) => $item->akunReferensi?->kategori !== 'HPP' ? (float) $item->total : 0);

                return (object) [
                    'total_upah' => $totalUpah,
                    'total_operasional' => $totalOperasional,
                ];
            });

        $rows = Unit::query()
            ->orderBy('zona')
            ->orderBy('nama_unit')
            ->get()
            ->map(function ($unit) use ($materialCosts, $cashCosts) {
                $material = (float) ($materialCosts[$unit->id] ?? 0);
                $cash = $cashCosts->get($unit->nama_unit);
                $upah = (float) ($cash->total_upah ?? 0);
                $operasional = (float) ($cash->total_operasional ?? 0);
                $total = $material + $upah + $operasional;

                return [
                    'id' => $unit->id,
                    'nama_unit' => $unit->nama_unit,
                    'zona' => $unit->zona,
                    'biaya_material' => $material,
                    'biaya_upah' => $upah,
                    'biaya_operasional' => $operasional,
                    'total_hpp' => $total,
                ];
            });

        $totalProyek = $rows->sum('total_hpp');
        $unitTertinggi = $rows->sortByDesc('total_hpp')->first();
        $rataRata = $rows->count() ? $totalProyek / $rows->count() : 0;

        return Inertia::render('HPP/Index', [
            'rows' => $rows->values(),
            'summary' => [
                'total_proyek' => $totalProyek,
                'rata_rata' => $rataRata,
                'unit_tertinggi' => $unitTertinggi,
            ],
        ]);
    }
}