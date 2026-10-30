<?php

namespace Modules\Master\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CoreTagRequests extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string']
        ];
    }
}
