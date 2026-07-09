<?php

namespace App\Http\Controllers;

public function index(): Response
{
    return Inertia::render('LogGudang/Index', [
        'logMasuk'  => LogMasukGudang::with('material')->orderByDesc('tanggal')->get(),
        'logKeluar' => LogKeluarHarian::with(['material', 'unit'])->orderByDesc('tanggal')->get(),
        'materials' => Material::orderBy('nama_material')
            ->get(['id', 'kode_material as kode', 'nama_material as nama', 'satuan']),
        'units'     => Unit::orderBy('nama_unit')->get(['id', 'nama_unit', 'zona']),
        'stok'      => StokGudangService::summary(),
    ]);
}

public function storeMasuk(StoreLogMasukRequest $request)
{
    LogMasukGudang::create([...$request->validated(), 'created_by' => Auth::id()]);
    return back()->with('success', 'Log masuk berhasil ditambahkan.');
}

public function storeKeluar(StoreLogKeluarRequest $request)
{
    LogKeluarHarian::create([...$request->validated(), 'created_by' => Auth::id()]);
    return back()->with('success', 'Log keluar berhasil ditambahkan.');
}
