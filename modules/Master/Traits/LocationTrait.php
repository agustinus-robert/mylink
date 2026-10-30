<?php

namespace Modules\Master\Traits;

use Modules\Master\Models\Province;
use Modules\Master\Models\Regency;
use Modules\Master\Models\City;

trait LocationTrait
{
    public function getLocation()
    {
        $province = Province::get();
        $regency = Regency::get();
        $city = City::get();

        return [
            'province' => $province,
            'regency' => $regency,
            'city' => $city
        ];
    }
}
