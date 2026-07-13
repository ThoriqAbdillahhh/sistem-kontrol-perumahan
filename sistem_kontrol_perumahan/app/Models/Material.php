<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'kode_material', 'nama_material', 'satuan', 'kategori', 'harga',
    ];

    public function logMasuk()
    {
        return $this->hasMany(LogMasukGudang::class);
    }

    public function logKeluar()
    {
        return $this->hasMany(LogKeluarHarian::class);
    }
}