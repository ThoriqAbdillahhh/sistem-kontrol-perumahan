<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKasMasukRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // sudah dihandle middleware role di route
    }

    public function rules(): array
    {
        return [
            'tanggal' => ['required', 'date'],
            'akun_referensi_id' => ['required', 'exists:akun_referensis,id'],
            'keterangan' => ['nullable', 'string', 'max:500'],
            'nominal' => ['required', 'numeric', 'min:0'],
            'dari' => ['required', 'string', 'max:255'],
            'untuk' => ['nullable', 'string', 'max:255'],
        ];
    }
}