<?php

namespace Modules\Master\Services;

use Modules\Master\Repositories\TagRepository;

class TagService
{
    public function __construct(
        protected TagRepository $tagRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->tagRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->tagRepository->stored($data);
        }

        return $this->tagRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->tagRepository->deleted($id);
    }
}
