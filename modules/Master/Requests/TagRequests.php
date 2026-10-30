<?php

namespace Modules\Master\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TagRequests extends FormRequest
{
    public function rules(): array
    {
        return [
            'parent_id' => ['required'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string']
        ];
    }
}
