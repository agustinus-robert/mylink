<?php

namespace Modules\Master\Services;

use Modules\Master\Repositories\SubCategoryRepository;

class SubCategoryService
{
    public function __construct(
        protected SubCategoryRepository $subCategoryRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->subCategoryRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->subCategoryRepository->stored($data);
        }

        return $this->subCategoryRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->subCategoryRepository->deleted($id);
    }
}
