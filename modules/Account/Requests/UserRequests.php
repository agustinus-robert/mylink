<?php

namespace Modules\Account\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequests extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'password' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'string',
                'max:100',
            ],
            'role_id' => ['required', 'integer'],
        ];
    }
}
