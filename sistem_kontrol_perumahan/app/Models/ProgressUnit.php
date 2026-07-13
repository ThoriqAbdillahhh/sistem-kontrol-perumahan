<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgressUnit extends Model
{
    protected $table = 'progress_unit';

    protected $fillable = [
        'unit_id', 'progress_percent', 'tanggal_update', 'status', 'updated_by',
    ];

    protected $casts = [
        'tanggal_update' => 'date',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }
}