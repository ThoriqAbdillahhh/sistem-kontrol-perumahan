<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKasKeluarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal'    => ['required', 'date'],
            'akun_id'    => ['required', 'exists:akun_referensis,id'],
            'unit_id'    => ['required', 'exists:units,id'],
            'nominal'    => ['required', 'numeric', 'min:0.01'],
            'no_spj'     => ['nullable', 'string', 'max:50'],
            'keterangan' => ['nullable', 'string'],
        ];
    }
}
