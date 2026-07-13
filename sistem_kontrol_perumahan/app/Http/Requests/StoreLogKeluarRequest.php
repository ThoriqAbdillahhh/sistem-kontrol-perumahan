<?php

namespace App\Http\Requests;

use App\Services\StokGudangService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreLogKeluarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
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

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $materialId = $this->input('material_id');
            $qtyDiminta = (float) $this->input('qty');

            if (! $materialId || $qtyDiminta <= 0) {
                return;
            }

            $stokService = app(StokGudangService::class);
            $stokTersedia = $stokService->stokMaterial((int) $materialId);

            // Kalau ini update, qty lama record ini dikembalikan dulu ke stok
            // sebelum dicek, karena qty lama bakal digantikan qty baru.
            $logKeluar = $this->route('logKeluar');
            if ($logKeluar && (int) $logKeluar->material_id === (int) $materialId) {
                $stokTersedia += (float) $logKeluar->qty;
            }

            if ($qtyDiminta > $stokTersedia) {
                $validator->errors()->add(
                    'qty',
                    "Stok tidak mencukupi. Sisa stok tersedia: {$stokTersedia}."
                );
            }
        });
    }
}