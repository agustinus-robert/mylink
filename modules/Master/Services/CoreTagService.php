<?php

namespace Modules\Master\Services;

use Modules\Master\Repositories\CoreTagRepository;

class CoreTagService
{
    public function __construct(
        protected CoreTagRepository $coreTagRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->coreTagRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->coreTagRepository->stored($data);
        }

        return $this->coreTagRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->coreTagRepository->deleted($id);
    }
}
