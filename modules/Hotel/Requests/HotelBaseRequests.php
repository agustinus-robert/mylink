<?php

namespace Modules\Hotel\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HotelBaseRequests extends FormRequest
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
        $hotel = $this->route('base_hotel');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'code' => [
                'required',
                'string',
                'size:6',
                Rule::unique('hotels', 'code')
                    ->ignore($hotel?->id),
            ],

            'phone' => [
                'required',
                'numeric',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'address' => [
                'required',
                'string',
            ],

            'city_id' => [
                'required',
                'integer',
            ],

            'regency_id' => [
                'required',
                'integer',
            ],

            'province_id' => [
                'required',
                'integer',
            ],

            'latitude' => [
                'required',
                'numeric',
                'between:-90,90',
            ],

            'longitude' => [
                'required',
                'numeric',
                'between:-180,180',
            ],
        ];
    }
}
