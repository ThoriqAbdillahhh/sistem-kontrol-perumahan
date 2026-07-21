<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKasMasukRequest extends FormRequest
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
            'nominal'    => ['required', 'numeric', 'min:0.01'],
            'keterangan' => ['nullable', 'string'],
        ];
    }
}
