<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Material extends Model
{
    protected $fillable = [
        'kode_material',
        'nama_material',
        'satuan',
        'kategori',
        'harga',
    ];

    protected $casts = [
        'harga' => 'decimal:2',
    ];

    // Dipakai oleh Orang C (log gudang) & Orang D (matrix progress) — jangan diubah namanya.
//     public function logMasuk(): HasMany
//     {
//         return $this->hasMany(LogMasukGudang::class);
//     }

//     public function logKeluar(): HasMany
//     {
//         return $this->hasMany(LogKeluarHarian::class);
//     }

//     public function matrixDetail(): HasMany
//     {
//         return $this->hasMany(MatrixProgressDetail::class);
//     }
// }
}