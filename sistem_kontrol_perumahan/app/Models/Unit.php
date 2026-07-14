<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    protected $table = 'units';

    protected $fillable = [
        'nama_unit', 'zona', 'status', 'tukang', 'tanggal_mulai', 'keterangan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
    ];

    public function progress()
    {
        return $this->hasMany(ProgressUnit::class, 'unit_id');
    }

    public function latestProgress()
    {
        return $this->hasOne(ProgressUnit::class, 'unit_id')->latestOfMany('id');
    }

    public function logKeluar()
    {
        return $this->hasMany(LogKeluarHarian::class);
    }
}