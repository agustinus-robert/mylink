<?php

namespace Modules\Transaction\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Arr;

class IncomingRequests extends FormRequest
{
    public function rules(): array
    {
        return [
            'code' => ['required', 'string'],
            'name' => ['required', 'string'],
            'slug' => ['required', 'string'],
            'category_id' => ['required', 'integer', 'exists:mst_categories,id'],
            'sub_category_id' => [
                'required',
                'integer',
                'exists:mst_sub_categories,id',
            ],
            'affiliate_link' => ['required', 'string'],
            'link' => ['required', 'string', 'max:5120'],
            'address' => ['required', 'string'],
            'province_id' => ['required', 'integer', 'exists:ref_provinces,id'],
            'district_id' => ['required', 'integer', 'exists:ref_regencies,id'],
            'prices' => ['required', 'numeric'],
            'recorded_at' => ['required', 'date']
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        dd([
            'errors' => $validator->errors()->toArray(),
            'input' => $this->all(),
            'failed' => $validator->failed(),
        ]);

        throw new ValidationException($validator);
    }

    public function transform(): array
    {
        $data = $this->validated();

        return [
            'summary' => Arr::only($data, [
                'code',
                'name',
                'slug',
                'category_id',
                'sub_category_id',
                'link',
                'affiliate_link'
            ]),
            'location' => [ 
               'address' => $data['address'],
               'province' => $data['province_id'],
               'district' => $data['district_id']
            ],
            'prices' => Arr::only($data, [
                'prices',
                'recorded_at'
            ]),
        ];
    }
}
