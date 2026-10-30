<?php

namespace Modules\Account\Services;

use Modules\Account\Repositories\RolePermissionRepository;

class RolePermissionService
{
    public function __construct(
        protected RolePermissionRepository $rolePermissionRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->rolePermissionRepository->paginate($filters);
    }

    public function form(array $data = [])
    {
        $rolePermissions = [];

        foreach ($data['permissions'] as $value) {
            $rolePermissions[] = $this->rolePermissionRepository->stored([
                'role_id' => $data['role_id'],
                ...$value,
            ]);
        }

        return $rolePermissions;
    }

    public function deletion($id)
    {
        return $this->rolePermissionRepository->deleted($id);
    }
}
