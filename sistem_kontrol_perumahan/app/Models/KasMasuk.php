<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KasMasuk extends Model
{
    protected $table = 'kas_masuk';

    protected $fillable = [
        'tanggal',
        'akun_id',
        'nominal',
        'keterangan',
        'created_by',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'nominal' => 'decimal:2',
    ];

    public function akun()
    {
        return $this->belongsTo(AkunReferensi::class, 'akun_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
