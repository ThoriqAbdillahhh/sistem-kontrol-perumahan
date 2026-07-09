<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLogKeluarRequest;
use App\Http\Requests\StoreLogMasukRequest;
use App\Models\LogKeluarHarian;
use App\Models\LogMasukGudang;
use App\Models\Material;
use App\Models\Unit;
use App\Services\StokGudangService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

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
}
