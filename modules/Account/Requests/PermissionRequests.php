<?php

namespace Modules\Account\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PermissionRequests extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255']
        ];
    }
}
