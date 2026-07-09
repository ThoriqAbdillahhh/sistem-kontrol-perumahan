<?php

namespace App\models;

use Illuminate\Database\Eluquent\Attributes\Model;

class LogMasukGudang extends Model
{
    protected $table = 'log_masuk_gudang';

    protected $fillable = 
    [
    'tanggal', 
    'supplier', 
    'material_id', 
    'qty', 
    'harga_satuan', 
    'total_harga', 
    'keterangan',
    'created_by'];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'qty' => 'decimal:2',
            'harga_satuan' => 'decimal:2',
            'total_harga' => 'decimal:2',
        ];
    }
    
        public function material()
    {

        return $this->belongsTo(Material::class);
    }
}