<?php

namespace Modules\Hotel\Services;

use Modules\Hotel\Repositories\HotelFloorRepository;

class HotelFloorService
{
    public function __construct(
        protected HotelFloorRepository $hotelFloorRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->hotelFloorRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->hotelFloorRepository->stored($data);
        }

        return $this->hotelFloorRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->hotelFloorRepository->deleted($id);
    }
}
