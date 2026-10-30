<?php

namespace Modules\Master\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequests extends FormRequest
{
    public function rules(): array
    {
        return [
            'code' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
