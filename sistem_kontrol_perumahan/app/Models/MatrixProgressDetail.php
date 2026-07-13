<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatrixProgressDetail extends Model
{
    protected $table = 'matrix_progress_detail';

    protected $fillable = [
        'matrix_id', 'material_id', 'qty_standar', 'batas_warning', 'batas_boros',
    ];

    public function matrix()
    {
        return $this->belongsTo(MatrixProgress::class, 'matrix_id');
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}