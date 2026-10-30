<?php

namespace Modules\Hotel\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AmnitiesRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
            ],

            'icon' => [
                'required',
                'string',
            ],

            'status' => [
                'required',
                'numeric',
            ],
        ];
    }
}
