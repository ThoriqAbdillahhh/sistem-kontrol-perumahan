<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $unitId = $this->route('unit')?->id;

        return [
            'nama_unit' => [
                'required', 'string', 'max:50',
                function ($attribute, $value, $fail) use ($unitId) {
                    $exists = \App\Models\Unit::whereRaw('LOWER(nama_unit) = ?', [strtolower($value)])
                        ->when($unitId, fn ($q) => $q->where('id', '!=', $unitId))
                        ->exists();

                    if ($exists) {
                        $fail('Nama unit sudah digunakan.');
                    }
                },
            ],
            'zona'          => ['required', 'string', 'max:20'],
            'status'        => ['required', 'string', 'in:Aktif,Non-aktif'],
            'tukang'        => ['required', 'string', 'max:100'],
            'tanggal_mulai' => ['nullable', 'date'],
            'keterangan'    => ['nullable', 'string'],
        ];
    }
}