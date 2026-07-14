<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMatrixDetailRequest;
use App\Http\Requests\StoreMatrixProgressRequest;
use App\Models\Material;
use App\Models\MatrixProgress;
use App\Models\MatrixProgressDetail;
use Inertia\Inertia;

class StandarProgressController extends Controller
{
    /**
     * GET /standar
     */
    public function index()
    {
        // matrixRows: bentuk data DIRATAKAN (flat) sesuai kebutuhan StandarProgressIndex.jsx
        // -> setiap detail langsung punya kode_material/nama_material/satuan,
        //    bukan nested detail.material.nama_material.
        $matrixRows = MatrixProgress::with('details.material')
            ->orderBy('batas_atas')
            ->get()
            ->map(function ($matrix) {
                return [
                    'id' => $matrix->id,
                    'batas_atas' => $matrix->batas_atas,
                    'range_progress' => $matrix->range_progress, 
                    'tahap_pekerjaan' => $matrix->tahap_pekerjaan,
                    'details' => $matrix->details->map(function ($d) {
                        return [
                            'id' => $d->id,
                            'material_id' => $d->material_id,
                            'kode_material' => $d->material->kode_material,
                            'nama_material' => $d->material->nama_material,
                            'satuan' => $d->material->satuan,
                            'qty_standar' => (float) $d->qty_standar,
                        ];
                    })->values(),
                ];
            });

        $materials = Material::orderBy('nama_material')
            ->get(['id', 'kode_material', 'nama_material', 'satuan']);

         $usedTahap = $matrixRows->pluck('tahap_pekerjaan')->toArray();
        $tahapOptions = collect(MatrixProgress::MASTER_TAHAP)
            ->reject(fn ($item) => in_array($item['tahap_pekerjaan'], $usedTahap))
            ->values();

       return Inertia::render('StandarProgress/StandarProgressIndex', [
            'matrixRows' => $matrixRows,
            'materials' => $materials,
            // TODO: middleware role belum ada di project ini.
            // Project ini pakai Spatie Permission (terlihat dari query model_has_roles).
            'canEdit' => auth()->user()?->hasRole('Super Admin') ?? false,
            'tahapOptions' => $tahapOptions,
            ]);
    }

    /**
     * POST /standar
     */
    public function store(StoreMatrixProgressRequest $request)
    {
        MatrixProgress::create($request->validated());

        return redirect()
            ->route('standar.index')
            ->with('success', 'Tahap standar progres berhasil ditambahkan.');
    }

    /**
     * PUT /standar/{matrix}
     */
    public function update(StoreMatrixProgressRequest $request, MatrixProgress $matrix)
    {
        $matrix->update($request->validated());

        return redirect()
            ->route('standar.index')
            ->with('success', 'Tahap standar progres berhasil diperbarui.');
    }

    /**
     * DELETE /standar/{matrix}
     */
    public function destroy(MatrixProgress $matrix)
    {
        $matrix->details()->delete();
        $matrix->delete();

        return redirect()
            ->route('standar.index')
            ->with('success', 'Tahap standar progres berhasil dihapus.');
    }

    /**
     * POST /standar/{matrix}/detail
     * updateOrCreate supaya 1 material tidak dobel di tahap yang sama.
     */
    public function storeDetail(StoreMatrixDetailRequest $request, MatrixProgress $matrix)
    {
        $matrix->details()->updateOrCreate(
            ['material_id' => $request->validated('material_id')],
            ['qty_standar' => $request->validated('qty_standar')]
        );

        return redirect()
            ->route('standar.index')
            ->with('success', 'Standar material berhasil disimpan.');
    }

    /**
     * PUT /standar-detail/{detail}
     */
    public function updateDetail(StoreMatrixDetailRequest $request, MatrixProgressDetail $detail)
    {
        $detail->update($request->validated());

        return redirect()
            ->route('standar.index')
            ->with('success', 'Standar material berhasil diperbarui.');
    }

    /**
     * DELETE /standar-detail/{detail}
     */
    public function destroyDetail(MatrixProgressDetail $detail)
    {
        $detail->delete();

        return redirect()
            ->route('standar.index')
            ->with('success', 'Standar material berhasil dihapus.');
    }
}