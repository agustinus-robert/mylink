<?php

namespace Modules\Hotel\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HotelBuildingRequests extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->isMethod('post') && ! $this->filled('code')) {
            $this->merge([
                'code' => str_pad(
                    (string) random_int(0, 999999),
                    6,
                    '0',
                    STR_PAD_LEFT
                ),
            ]);
        }
    }

    public function rules(): array
    {
        $building = $this->route('building');

        return [
            'code' => [
                'required',
                'string',
                'size:6',
                Rule::unique('hotel_buildings', 'code')
                    ->ignore($building?->id),
            ],
            'hotel_id' => [
                'required',
                'numeric'
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable'
            ]
        ];
    }
}
