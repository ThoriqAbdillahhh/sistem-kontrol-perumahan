<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgressUnit extends Model
{
    protected $table = 'progress_unit';

    protected $fillable = [
        'unit_id',
        'progress_percent',
        'tanggal_update',
        'status',
        'updated_by',
    ];
}