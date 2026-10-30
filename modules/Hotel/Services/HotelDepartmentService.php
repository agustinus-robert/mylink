<?php

namespace Modules\Hotel\Services;

use Modules\Hotel\Repositories\HotelDepartmentRepository;

class HotelDepartmentService
{
    public function __construct(
        protected HotelDepartmentRepository $hotelDepartmentRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->hotelDepartmentRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->hotelDepartmentRepository->stored($data);
        }

        return $this->hotelDepartmentRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->hotelDepartmentRepository->deleted($id);
    }
}
