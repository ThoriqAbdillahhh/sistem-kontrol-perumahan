<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProgressUnitRequest;
use App\Models\ProgressUnit;
use App\Models\Unit;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProgressController extends Controller
{
    public function index()
    {
        $units = Unit::with('latestProgress')->orderBy('nama_unit')->get();

        $monitoring = DB::table('v_monitoring_progress')
            ->orderBy('nama_material')
            ->get()
            ->groupBy('unit_id');

        return Inertia::render('Progress/Index', [
            'units'      => $units,
            'monitoring' => $monitoring,
        ]);
    }

    public function store(StoreProgressUnitRequest $request)
    {
        ProgressUnit::create([
            ...$request->validated(),
            'updated_by' => Auth::id(),
        ]);

        return back()->with('success', 'Progress unit berhasil diperbarui.');
    }
}