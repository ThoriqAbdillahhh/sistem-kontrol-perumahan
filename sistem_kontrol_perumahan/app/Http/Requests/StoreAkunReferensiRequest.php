<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAkunReferensiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Saat update, route model binding mengisi {akunReferensi} sehingga
        // ID-nya bisa dipakai untuk mengecualikan diri sendiri dari cek unique.
        $akunReferensi = $this->route('akunReferensi');

        return [
            'kode_akun' => [
                'required',
                'string',
                'max:20',
                Rule::unique('akun_referensis', 'kode_akun')->ignore($akunReferensi?->id),
            ],
            'nama_akun' => ['required', 'string', 'max:255'],
            'kategori' => ['required', Rule::in(['HPP', 'Operasional'])],
        ];
    }

    public function messages(): array
    {
        return [
            'kode_akun.required' => 'Kode akun wajib diisi.',
            'kode_akun.unique' => 'Kode akun ini sudah dipakai.',
            'nama_akun.required' => 'Nama akun wajib diisi.',
            'kategori.required' => 'Kategori wajib dipilih.',
            'kategori.in' => 'Kategori tidak valid.',
        ];
    }
}