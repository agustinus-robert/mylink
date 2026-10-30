<?php

namespace Modules\Hotel\Services;

use Modules\Hotel\Repositories\HotelBuildingRepository;

class HotelBuildingService
{
    public function __construct(
        protected HotelBuildingRepository $hotelBuildingRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->hotelBuildingRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->hotelBuildingRepository->stored($data);
        }

        return $this->hotelBuildingRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->hotelBuildingRepository->deleted($id);
    }
}
