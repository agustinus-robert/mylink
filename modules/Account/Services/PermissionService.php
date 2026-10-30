<?php

namespace Modules\Account\Services;

use Modules\Account\Repositories\PermissionRepository;

class PermissionService
{
    public function __construct(
        protected PermissionRepository $permissionRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->permissionRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->permissionRepository->stored($data);
        }

        return $this->permissionRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->permissionRepository->deleted($id);
    }
}
