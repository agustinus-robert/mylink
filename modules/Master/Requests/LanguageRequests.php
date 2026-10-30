<?php

namespace Modules\Master\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LanguageRequests extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string']
        ];
    }
}
