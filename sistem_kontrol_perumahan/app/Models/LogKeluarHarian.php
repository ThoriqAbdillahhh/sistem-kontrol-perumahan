<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogKeluarHarian extends Model
{
    protected $table = 'log_keluar_harian';

    protected $fillable = [
        'tanggal',
        'material_id',
        'unit_id',
        'qty',
        'harga',
        'total',
        'keterangan',
        'created_by'
    ];
    protected function casts(): array
    {
        return ['tanggal' => 'date', 'qty' => 'decimal:2', 'harga' => 'decimal:2', 'total' => 'decimal:2'];
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}