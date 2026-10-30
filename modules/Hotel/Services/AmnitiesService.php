<?php

namespace Modules\Hotel\Services;

use Modules\Hotel\Repositories\AmnitiesRepository;

class AmnitiesService
{
    public function __construct(
        protected AmnitiesRepository $amnitiesRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->amnitiesRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->amnitiesRepository->stored($data);
        }

        return $this->amnitiesRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->amnitiesRepository->deleted($id);
    }
}
