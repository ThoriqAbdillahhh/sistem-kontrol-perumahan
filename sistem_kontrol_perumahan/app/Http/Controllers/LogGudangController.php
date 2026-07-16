<?php

namespace App\Http\Controllers;

use App\Models\ProgressUnit;
use App\Http\Requests\StoreLogKeluarRequest;
use App\Http\Requests\StoreLogMasukRequest;
use App\Models\LogKeluarHarian;
use App\Models\LogMasukGudang;
use App\Models\Material;
use App\Models\Unit;
use App\Services\StokGudangService;
use App\Services\MaterialConsumptionService;
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
                            ->with('latestLogMasuk')
                            ->get(['id', 'kode_material as kode', 'nama_material as nama', 'satuan'])
                            ->map(fn ($m) => [
                                'id'             => $m->id,
                                'kode'           => $m->kode,
                                'nama'           => $m->nama,
                                'satuan'         => $m->satuan,
                                'harga_terakhir' => $m->latestLogMasuk->harga_satuan ?? 0,
                ]),
            'units'     => Unit::orderBy('nama_unit')->get(['id', 'nama_unit', 'zona']),
            'stok'      => (new StokGudangService())->stokSemuaMaterial(),
        ]);
    }

    public function history()
    {
        $histories = \App\Models\LogGudangHistory::with('user.roles')
            ->orderByDesc('created_at')
            ->take(100)
            ->get();

        $materials = Material::pluck('nama_material', 'id')->toArray();
        $units = Unit::pluck('nama_unit', 'id')->toArray();

        $formatted = $histories->map(function ($h) use ($materials, $units) {
            $details = [];
            $actionWord = '';
            
            switch ($h->action) {
                case 'create':
                    $actionWord = 'Menambahkan';
                    break;
                case 'update':
                    $actionWord = 'Mengubah';
                    break;
                case 'delete':
                    $actionWord = 'Menghapus';
                    break;
            }

            $logTypeWord = $h->tipe_log === 'masuk' ? 'Log Masuk' : 'Log Keluar';
            
            $data = $h->action === 'delete' ? $h->data_lama : $h->data_baru;
            $materialName = $materials[$data['material_id'] ?? null] ?? 'Material Tidak Diketahui';
            
            $summary = "{$actionWord} {$logTypeWord} - {$materialName}";

            if ($h->action === 'update') {
                $diff = [];
                $keysToCompare = [
                    'tanggal' => 'Tanggal',
                    'supplier' => 'Supplier',
                    'unit_id' => 'Unit',
                    'material_id' => 'Material',
                    'qty' => 'Qty',
                    'harga_satuan' => 'Harga Satuan',
                    'harga' => 'Harga',
                    'total_harga' => 'Total Harga',
                    'total' => 'Total',
                    'keterangan' => 'Keterangan'
                ];

                foreach ($keysToCompare as $key => $label) {
                    $oldVal = $h->data_lama[$key] ?? null;
                    $newVal = $h->data_baru[$key] ?? null;

                    // Normalisasi null & string kosong
                    $oldValClean = ($oldVal === null || $oldVal === '') ? null : $oldVal;
                    $newValClean = ($newVal === null || $newVal === '') ? null : $newVal;
                    if ($oldValClean === $newValClean) continue;

                    // Bandingkan tanggal (hanya format YYYY-MM-DD)
                    if ($key === 'tanggal') {
                        $oldDate = $oldVal ? substr($oldVal, 0, 10) : null;
                        $newDate = $newVal ? substr($newVal, 0, 10) : null;
                        if ($oldDate === $newDate) continue;
                    }

                    // Bandingkan numerik
                    if (is_numeric($oldVal) && is_numeric($newVal)) {
                        if (floatval($oldVal) === floatval($newVal)) continue;
                    } else {
                        if ($oldVal === $newVal) continue;
                    }

                    if ($key === 'material_id') {
                        $oldVal = $materials[$oldVal] ?? "ID $oldVal";
                        $newVal = $materials[$newVal] ?? "ID $newVal";
                    } elseif ($key === 'unit_id') {
                        $oldVal = $units[$oldVal] ?? "ID $oldVal";
                        $newVal = $units[$newVal] ?? "ID $newVal";
                    }

                    if (in_array($key, ['harga_satuan', 'harga', 'total_harga', 'total'])) {
                        $oldVal = 'Rp ' . number_format(floatval($oldVal ?? 0), 0, ',', '.');
                        $newVal = 'Rp ' . number_format(floatval($newVal ?? 0), 0, ',', '.');
                    }

                    if ($oldVal === null || $oldVal === '') {
                        $diff[] = "Mengisi {$label}: \"{$newVal}\"";
                    } elseif ($newVal === null || $newVal === '') {
                        $diff[] = "Menghapus {$label} (sebelumnya: \"{$oldVal}\")";
                    } else {
                        $diff[] = "Mengubah {$label} dari \"{$oldVal}\" menjadi \"{$newVal}\"";
                    }
                }
                $details = $diff;
            } else {
                $info = [];
                $info[] = "Tanggal: " . (is_array($data) && isset($data['tanggal']) ? substr($data['tanggal'], 0, 10) : '-');
                if ($h->tipe_log === 'masuk') {
                    $info[] = "Supplier: " . ($data['supplier'] ?? '-');
                } else {
                    $unitName = $units[$data['unit_id'] ?? null] ?? 'Unit Tidak Diketahui';
                    $info[] = "Unit: " . $unitName;
                }
                $info[] = "Qty: " . ($data['qty'] ?? 0);
                
                $hargaKey = $h->tipe_log === 'masuk' ? 'harga_satuan' : 'harga';
                $totalKey = $h->tipe_log === 'masuk' ? 'total_harga' : 'total';
                
                $hargaVal = 'Rp ' . number_format(floatval($data[$hargaKey] ?? 0), 0, ',', '.');
                $totalVal = 'Rp ' . number_format(floatval($data[$totalKey] ?? 0), 0, ',', '.');
                
                $info[] = "Harga: " . $hargaVal;
                $info[] = "Total: " . $totalVal;
                
                if (!empty($data['keterangan'])) {
                    $info[] = "Keterangan: " . $data['keterangan'];
                }
                $details = $info;
            }

            return [
                'id' => $h->id,
                'user_name' => $h->user->name ?? 'System/Deleted User',
                'user_role' => $h->user ? $h->user->roles->pluck('name')->first() : '-',
                'tipe_log' => $h->tipe_log,
                'action' => $h->action,
                'summary' => $summary,
                'details' => $details,
                'created_at' => $h->created_at->setTimezone('Asia/Jakarta')->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json($formatted);
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
            $hasil = (new MaterialConsumptionService())->evaluasiUnit(
                $unit,
                $progressTerakhir->progress_percent
            );

            $progressTerakhir->update([
    'status_material' => $hasil['status'],
    'detail_material' => $hasil['detail'],
]);
        }
    }
}