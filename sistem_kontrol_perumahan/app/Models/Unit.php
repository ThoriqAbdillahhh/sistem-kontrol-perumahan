<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $table = 'units';

    protected $fillable = ['nama_unit', 'zona', 'status', 'tukang', 'tanggal_mulai', 'keterangan'];
}