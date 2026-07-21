<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAkunReferensiRequest;
use App\Models\AkunReferensi;
use App\Models\AkunReferensiHistory;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AkunReferensiController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $isSuperAdmin = $user->hasRole('Super Admin');

        // Super Admin lihat semua termasuk yang sudah dihapus (soft delete).
        // Admin Keuangan hanya lihat yang masih aktif (default query Eloquent
        // otomatis exclude yang soft-deleted).
        $query = $isSuperAdmin ? AkunReferensi::withTrashed() : AkunReferensi::query();

        $akunList = $query
            ->with(['creator:id,name', 'updater:id,name', 'deleter:id,name'])
            ->orderBy('kode_akun')
            ->get()
            ->map(function (AkunReferensi $akun) use ($isSuperAdmin, $user) {
                $indicator = null;

                // Indikator cuma dihitung untuk Super Admin, dan disembunyikan
                // kalau pelaku terakhir adalah user yang sedang login sendiri.
                if ($isSuperAdmin) {
                    if ($akun->trashed() && $akun->deleted_by !== $user->id) {
                        $indicator = [
                            'type' => 'deleted',
                            'message' => sprintf(
                                'Akun ini telah dihapus oleh %s pada %s',
                                $akun->deleter?->name ?? 'seseorang',
                                $akun->deleted_at->translatedFormat('d M Y, H:i')
                            ),
                        ];
                    } elseif (!$akun->trashed()
                        && $akun->updated_by
                        && !$akun->wasRecentlyCreated
                        && $akun->updated_at->ne($akun->created_at)
                        && $akun->updated_by !== $user->id
                    ) {
                        $indicator = [
                            'type' => 'edited',
                            'message' => sprintf(
                                'Akun telah diedit oleh %s pada %s',
                                $akun->updater?->name ?? 'seseorang',
                                $akun->updated_at->translatedFormat('d M Y, H:i')
                            ),
                        ];
                    } elseif (!$akun->trashed()
                        && $akun->updated_at->eq($akun->created_at)
                        && $akun->created_by
                        && $akun->created_by !== $user->id
                    ) {
                        $indicator = [
                            'type' => 'created',
                            'message' => sprintf(
                                'Akun ditambahkan oleh %s pada %s',
                                $akun->creator?->name ?? 'seseorang',
                                $akun->created_at->translatedFormat('d M Y, H:i')
                            ),
                        ];
                    }
                }

                return [
                    'id' => $akun->id,
                    'kode_akun' => $akun->kode_akun,
                    'nama_akun' => $akun->nama_akun,
                    'kategori' => $akun->kategori,
                    'is_deleted' => $akun->trashed(),
                    'indicator' => $indicator,
                ];
            })
            ->values();

        $histories = $isSuperAdmin
            ? AkunReferensiHistory::with(['user:id,name'])
                ->latest()
                ->limit(100)
                ->get()
                ->map(fn (AkunReferensiHistory $h) => [
                    'id' => $h->id,
                    'aksi' => $h->aksi,
                    'kode_akun' => $h->akunReferensi?->kode_akun,
                    'nama_akun' => $h->akunReferensi?->nama_akun,
                    'user' => $h->user?->name ?? 'Sistem',
                    'created_at' => $h->created_at->translatedFormat('d M Y, H:i'),
                ])
            : [];

        return Inertia::render('AkunReferensi/Index', [
            'akunList' => $akunList,
            'histories' => $histories,
            'isSuperAdmin' => $isSuperAdmin,
        ]);
    }

    public function store(StoreAkunReferensiRequest $request)
    {
        $akun = AkunReferensi::create([
            ...$request->validated(),
            'created_by' => Auth::id(),
        ]);

        AkunReferensiHistory::create([
            'akun_referensi_id' => $akun->id,
            'user_id' => Auth::id(),
            'aksi' => 'ditambahkan',
        ]);

        return back()->with('success', 'Akun berhasil ditambahkan.');
    }

    public function update(StoreAkunReferensiRequest $request, AkunReferensi $akunReferensi)
    {
        $before = $akunReferensi->only(['kode_akun', 'nama_akun', 'kategori']);

        $akunReferensi->update([
            ...$request->validated(),
            'updated_by' => Auth::id(),
        ]);

        AkunReferensiHistory::create([
            'akun_referensi_id' => $akunReferensi->id,
            'user_id' => Auth::id(),
            'aksi' => 'diedit',
            'detail' => [
                'sebelum' => $before,
                'sesudah' => $akunReferensi->only(['kode_akun', 'nama_akun', 'kategori']),
            ],
        ]);

        return back()->with('success', 'Akun berhasil diperbarui.');
    }

    public function destroy(AkunReferensi $akunReferensi)
    {
        $akunReferensi->update(['deleted_by' => Auth::id()]);
        $akunReferensi->delete();

        AkunReferensiHistory::create([
            'akun_referensi_id' => $akunReferensi->id,
            'user_id' => Auth::id(),
            'aksi' => 'dihapus',
        ]);

        return back()->with('success', 'Akun berhasil dihapus.');
    }
}