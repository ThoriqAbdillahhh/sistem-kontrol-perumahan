<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatrixProgress extends Model
{
    use HasFactory;

    protected $table = 'matrix_progress';

    protected $fillable = [
        'tahap_pekerjaan',
    ];

    protected $casts = [
        'batas_atas' => 'integer',
    ];

 public const MASTER_TAHAP = [
        ['tahap_pekerjaan' => 'Persiapan + Galian',        'batas_atas' => 5,   'range_progress' => '0-5'],
        ['tahap_pekerjaan' => 'Pondasi',                   'batas_atas' => 10,  'range_progress' => '6-10'],
        ['tahap_pekerjaan' => 'Sloof',                     'batas_atas' => 15,  'range_progress' => '11-15'],
        ['tahap_pekerjaan' => 'Kolom + Ring Balok',         'batas_atas' => 20,  'range_progress' => '16-20'],
        ['tahap_pekerjaan' => 'Bata Tahap 1',               'batas_atas' => 25,  'range_progress' => '21-25'],
        ['tahap_pekerjaan' => 'Bata Tahap 2',               'batas_atas' => 35,  'range_progress' => '26-35'],
        ['tahap_pekerjaan' => 'Struktur Atas + Atap',       'batas_atas' => 45,  'range_progress' => '36-45'],
        ['tahap_pekerjaan' => 'Kuda-kuda + Penutup Atap',   'batas_atas' => 55,  'range_progress' => '46-55'],
        ['tahap_pekerjaan' => 'Plesteran',                  'batas_atas' => 65,  'range_progress' => '56-65'],
        ['tahap_pekerjaan' => 'Acian',                      'batas_atas' => 75,  'range_progress' => '66-75'],
        ['tahap_pekerjaan' => 'Keramik + Plumbing',         'batas_atas' => 85,  'range_progress' => '76-85'],
        ['tahap_pekerjaan' => 'Pengecatan + Instalasi',     'batas_atas' => 95,  'range_progress' => '86-95'],
        ['tahap_pekerjaan' => 'Finishing',                  'batas_atas' => 100, 'range_progress' => '96-100'],
    ];
    public static function findMaster(string $tahapPekerjaan): ?array
    {
        foreach (self::MASTER_TAHAP as $item) {
            if ($item['tahap_pekerjaan'] === $tahapPekerjaan) {
                return $item;
            }
        }
        return null;
    }
    protected static function booted()
    {
         static::saving(function ($matrix) {
            $master = self::findMaster($matrix->tahap_pekerjaan);

            if ($master) {
                $matrix->batas_atas = $master['batas_atas'];
                $matrix->range_progress = $master['range_progress'];
            }
        });
    }

    public function details()
    {
        return $this->hasMany(MatrixProgressDetail::class, 'matrix_id');
    }
    public function scopeUrut($query)
    {
        return $query->orderBy('batas_atas');
    }
}
