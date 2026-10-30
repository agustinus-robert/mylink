<?php

namespace Modules\Hotel\Services;

use Modules\Hotel\Repositories\HotelBaseRepository;

class HotelBaseService
{
    public function __construct(
        protected HotelBaseRepository $hotelBaseRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->hotelBaseRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->hotelBaseRepository->stored($data);
        }

        return $this->hotelBaseRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->hotelBaseRepository->deleted($id);
    }
}
