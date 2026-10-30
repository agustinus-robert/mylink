<?php

namespace Modules\Hotel\Traits;

use Modules\Hotel\Models\Hotel;
use Modules\Hotel\Models\Building;
use Modules\Hotel\Models\Floor;

trait HotelNeedingTraits
{
    public function getHotelNeeder($isFloor = false)
    {
        $neederArray = [];

        $neederArray['hotel'] = Hotel::get();
        $neederArray['building'] = Building::get();

        if ($isFloor == true) {
            $needer['floor'] = Floor::get();
        }

        return $neederArray;
    }
}
