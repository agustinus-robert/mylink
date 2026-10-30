<?php

namespace Modules\Master\Services;

use Modules\Master\Repositories\CategoryRepository;

class CategoryService
{
    public function __construct(
        protected CategoryRepository $categoryRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->categoryRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->categoryRepository->stored($data);
        }

        return $this->categoryRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->categoryRepository->deleted($id);
    }
}
