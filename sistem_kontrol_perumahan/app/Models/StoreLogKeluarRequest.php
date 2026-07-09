<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLogKeluarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['Super Admin', 'Admin']) ?? false;
    }

    public function rules(): array
    {
        return [
            'tanggal'     => ['required', 'date'],
            'unit_id'     => ['required', 'exists:units,id'],
            'material_id' => ['required', 'exists:materials,id'],
            'qty'         => ['required', 'numeric', 'min:0.01'],
            'harga'       => ['required', 'numeric', 'min:0'],
            'total'       => ['required', 'numeric', 'min:0'],
            'keterangan'  => ['nullable', 'string'],
        ];
    }
}