<?php

namespace Modules\Hotel\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HotelFloorRequests extends FormRequest
{
    public function rules(): array
    {
        return [
            'hotel_id' => [
                'required',
                'numeric'
            ],
            'building_id' => [
                'required',
                'numeric'
            ],
            'floor_number' => [
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
