<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AkunReferensi extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_akun',
        'jenis',
        'kategori',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeMasuk($query)
    {
        return $query->where('jenis', 'masuk')->where('is_active', true);
    }

    public function scopeKeluar($query)
    {
        return $query->where('jenis', 'keluar')->where('is_active', true);
    }
}