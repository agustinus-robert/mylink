<?php

namespace Modules\Hotel\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HotelDepartmentRequests extends FormRequest
{
    public function rules(): array
    {
        return [
            'hotel_id' => [
                'required',
                'numeric'
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ]
        ];
    }
}
