<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLogKeluarRequest;
use App\Http\Requests\StoreLogMasukRequest;
use App\Models\LogKeluarHarian;
use App\Models\LogMasukGudang;
use App\Models\Material;
use App\Models\ProgressUnit;
use App\Models\Unit;
use App\Services\MaterialConsumptionService;
use App\Services\StokGudangService;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LogGudangController extends Controller
{
    public function __construct(
        protected StokGudangService $stokService,
        protected MaterialConsumptionService $consumptionService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('LogGudang/Index', [
            'logMasuk'  => LogMasukGudang::with('material')->orderByDesc('tanggal')->get(),
            'logKeluar' => LogKeluarHarian::with(['material', 'unit'])->orderByDesc('tanggal')->get(),
            'materials' => Material::orderBy('nama_material')
                ->get(['id', 'kode_material as kode', 'nama_material as nama', 'satuan']),
            'units'     => Unit::orderBy('nama_unit')->get(['id', 'nama_unit', 'zona']),
            'stok'      => $this->stokService->stokSemuaMaterial(),
        ]);
    }

    public function storeMasuk(StoreLogMasukRequest $request)
    {
        LogMasukGudang::create([...$request->validated(), 'created_by' => Auth::id()]);

        return back()->with('success', 'Log masuk berhasil ditambahkan.');
    }

    public function storeKeluar(StoreLogKeluarRequest $request)
    {
        $data = $request->validated();

        LogKeluarHarian::create([...$data, 'created_by' => Auth::id()]);

        $unit = Unit::findOrFail($data['unit_id']);

        $progressTerakhir = ProgressUnit::where('unit_id', $unit->id)
            ->latest('tanggal_update')
            ->first();

        if ($progressTerakhir) {
            $hasil = $this->consumptionService->evaluasiUnit(
                $unit,
                $progressTerakhir->progress_percent
            );

            $progressTerakhir->update(['status' => $hasil['status']]);
        }

        return back()->with('success', 'Log keluar berhasil ditambahkan.');
    }
}
