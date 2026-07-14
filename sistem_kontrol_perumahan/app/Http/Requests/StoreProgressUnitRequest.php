<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgressUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'unit_id'          => ['required', 'exists:units,id'],
            'progress_percent' => ['required', 'numeric', 'min:0', 'max:100'],
            'tanggal_update'   => ['required', 'date'],
            'status'           => ['required', 'string', 'in:NOT STARTED,ON PROGRESS,DONE'],
        ];
    }
}