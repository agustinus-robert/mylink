<?php

namespace Modules\Hotel\Services;

use Modules\Hotel\Repositories\HotelStaffRepository;

class CompanyStaffService
{
    public function __construct(
        protected HotelStaffRepository $hotelStaffRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->hotelStaffRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->hotelStaffRepository->stored($data);
        }

        return $this->hotelStaffRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->hotelStaffRepository->deleted($id);
    }
}
