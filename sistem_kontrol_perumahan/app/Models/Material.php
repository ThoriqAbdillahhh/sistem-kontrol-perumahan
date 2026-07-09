<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'kode_material',
        'nama_material',
        'satuan',
        'kategori',
        'harga',
    ];
}