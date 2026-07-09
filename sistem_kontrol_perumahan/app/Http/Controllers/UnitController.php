<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUnitRequest;
use App\Models\Unit;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        return Inertia::render('Unit/Index', [
            'units' => Unit::orderBy('nama_unit')->get(),
        ]);
    }

    public function store(StoreUnitRequest $request)
    {
        Unit::create($request->validated());

        return redirect()->back()->with('success', 'Unit berhasil ditambahkan.');
    }

    public function update(StoreUnitRequest $request, Unit $unit)
    {
        $unit->update($request->validated());
    
        return redirect()->back()->with('success', 'Unit berhasil diperbarui.');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return redirect()->back()->with('success', 'Unit berhasil dihapus.');
    }
}