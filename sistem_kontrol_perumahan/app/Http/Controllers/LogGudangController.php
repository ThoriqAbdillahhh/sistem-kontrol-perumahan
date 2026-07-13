<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLogKeluarRequest;
use App\Http\Requests\StoreLogMasukRequest;
use App\Models\LogKeluarHarian;
use App\Models\LogMasukGudang;
use App\Models\Material;
use App\Models\Unit;
use App\Services\StokGudangService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LogGudangController extends Controller
{
    public function index()
    {
        return Inertia::render('LogGudang/Index', [
            'logMasuk'  => LogMasukGudang::with('material')->orderByDesc('tanggal')->get(),
            'logKeluar' => LogKeluarHarian::with(['material', 'unit'])->orderByDesc('tanggal')->get(),
            'materials' => Material::orderBy('nama_material')
                ->get(['id', 'kode_material as kode', 'nama_material as nama', 'satuan']),
            'units'     => Unit::orderBy('nama_unit')->get(['id', 'nama_unit', 'zona']),
            'stok'      => (new StokGudangService())->stokSemuaMaterial(),
        ]);
    }

    public function storeMasuk(StoreLogMasukRequest $request)
    {
        LogMasukGudang::create([...$request->validated(), 'created_by' => Auth::id()]);

        return back()->with('success', 'Log masuk berhasil ditambahkan.');
    }

    public function updateMasuk(StoreLogMasukRequest $request, LogMasukGudang $logMasuk)
    {
        $logMasuk->update($request->validated());

        return back()->with('success', 'Log masuk berhasil diperbarui.');
    }

    public function destroyMasuk(LogMasukGudang $logMasuk)
    {
        $logMasuk->delete();

        return back()->with('success', 'Log masuk berhasil dihapus.');
    }

    public function storeKeluar(StoreLogKeluarRequest $request)
    {
        $data = $request->validated();

        LogKeluarHarian::create([...$data, 'created_by' => Auth::id()]);

        $this->syncProgressStatus($data['unit_id']);

        return back()->with('success', 'Log keluar berhasil ditambahkan.');
    }

    public function updateKeluar(StoreLogKeluarRequest $request, LogKeluarHarian $logKeluar)
    {
        $data = $request->validated();

        $logKeluar->update($data);

        $this->syncProgressStatus($data['unit_id']);

        return back()->with('success', 'Log keluar berhasil diperbarui.');
    }

    public function destroyKeluar(LogKeluarHarian $logKeluar)
    {
        $unitId = $logKeluar->unit_id;

        $logKeluar->delete();

        $this->syncProgressStatus($unitId);

        return back()->with('success', 'Log keluar berhasil dihapus.');
    }

    private function syncProgressStatus(int $unitId): void
    {
        $unit = Unit::findOrFail($unitId);

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
    }
}