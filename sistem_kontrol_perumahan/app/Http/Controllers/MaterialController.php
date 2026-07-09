<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaterialRequest;
use App\Http\Requests\UpdateMaterialRequest;
use App\Models\Material;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    private const KATEGORI_OPTIONS = [
        'Struktur', 'Dinding', 'Atap', 'Finishing', 'Plumbing',
        'Elektrikal', 'Plafon', 'Pondasi', 'Bekisting',
    ];

    private const SATUAN_OPTIONS = [
        'Zak', 'Sak', 'Rit', 'M3', 'Bh', 'Btg', 'Kg', 'Lbr', 'Ltr', 'Dus', 'Set', 'Kaleng', 'Roll', 'Pail',
    ];

    public function index(): Response
    {
        return Inertia::render('Material/Index', [
            'materials' => Material::orderBy('kode_material')->get([
                'id', 'kode_material', 'nama_material', 'satuan', 'kategori', 'harga',
            ]),
            'kategoriOptions' => self::KATEGORI_OPTIONS,
            'satuanOptions'   => self::SATUAN_OPTIONS,
        ]);
    }

    public function store(StoreMaterialRequest $request)
    {
        Material::create($request->validated());

        return back()->with('success', 'Material baru berhasil ditambahkan.');
    }

    public function update(UpdateMaterialRequest $request, Material $material)
    {
        $material->update($request->validated());

        return back()->with('success', 'Material berhasil diperbarui.');
    }

    public function destroy(Material $material)
    {
        // Material yang sudah pernah dipakai di log gudang tetap boleh dihapus dari master;
        // histori transaksi lama tidak ikut terhapus (FK tidak cascade).
        $material->delete();

        return back()->with('success', 'Material berhasil dihapus.');
    }
}
