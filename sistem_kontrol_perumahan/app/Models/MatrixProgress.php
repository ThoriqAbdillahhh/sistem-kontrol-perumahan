<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatrixProgress extends Model
{
    protected $table = 'matrix_progress';

    protected $fillable = ['batas_atas', 'range_progress', 'tahap_pekerjaan'];

    public function details()
    {
        return $this->hasMany(MatrixProgressDetail::class, 'matrix_id');
    }
}