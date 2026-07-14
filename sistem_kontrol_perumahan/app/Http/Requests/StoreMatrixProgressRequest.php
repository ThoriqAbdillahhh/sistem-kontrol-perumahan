<?php

namespace App\Http\Requests;

use App\Models\MatrixProgress;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMatrixProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Otorisasi role sudah dihandle middleware('role:Super Admin') di routes/web.php
        return true;
    }

    public function rules(): array
    {
        // Saat update, $this->route('matrix') tersedia untuk exclude diri sendiri
        $matrixId = $this->route('matrix')?->id ?? $this->route('matrix');

        $namaTahapValid = array_column(MatrixProgress::MASTER_TAHAP, 'tahap_pekerjaan');
        
        return [
            'tahap_pekerjaan' => [
                'required',
                'string',
                Rule::in($namaTahapValid),
                Rule::unique('matrix_progress', 'tahap_pekerjaan')->ignore($matrixId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'tahap_pekerjaan.required' => 'Tahap pekerjaan wajib dipilih.',
            'tahap_pekerjaan.in' => 'Tahap pekerjaan tidak dikenali.',
            'tahap_pekerjaan.unique' => 'Tahap ini sudah ditambahkan sebelumnya.',
        ];
    }
}
