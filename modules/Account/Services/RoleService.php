<?php

namespace Modules\Account\Services;

use Modules\Account\Repositories\RoleRepository;

class RoleService
{
    public function __construct(
        protected RoleRepository $roleRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->roleRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->roleRepository->stored($data);
        }

        return $this->roleRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->roleRepository->deleted($id);
    }
}
