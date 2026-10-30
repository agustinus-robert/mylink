<?php

namespace Modules\Master\Services;

use Modules\Master\Repositories\LanguageRepository;

class LanguageService
{
    public function __construct(
        protected LanguageRepository $languageRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->languageRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->languageRepository->stored($data);
        }

        return $this->languageRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->languageRepository->deleted($id);
    }
}
