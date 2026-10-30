<?php

namespace Modules\Hotel\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompanyStaffRequests extends FormRequest
{
    public function rules(): array
    {
        return [
            'hotel_id' => [
                'required',
                'numeric'
            ],
            'user_id' => [
                'required',
                'numeric'
            ],
            'start_at' => [
                'required',
                'date_format:Y-m-d'
            ],
            'end_at' => [
                'required',
                'date_format:Y-m-d'
            ],
        ];
    }
}
