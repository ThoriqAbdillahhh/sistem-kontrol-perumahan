<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogKeluarHarian extends Model
{
    protected $table = 'log_keluar_harian';

    protected $fillable = [
        'tanggal', 'unit_id', 'material_id', 'qty',
        'harga', 'total', 'keterangan', 'created_by',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}