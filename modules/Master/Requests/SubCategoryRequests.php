<?php

namespace Modules\Master\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubCategoryRequests extends FormRequest
{
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:mst_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
