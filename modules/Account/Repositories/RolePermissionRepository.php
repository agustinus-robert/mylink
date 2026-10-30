<?php

namespace Modules\Account\Repositories;

use Modules\Account\Models\RolePermission;

class RolePermissionRepository
{
    public function paginate(array $filters)
    {
        return RolePermission::query()
            ->with('creator:id,name')
            ->name($filters['name'] ?? null)
            ->range(
                $filters['dateFrom'] ?? null,
                $filters['dateTo'] ?? null
            )
            ->archived($filters['archived'] ?? null)
            ->paginate(10);
    }

    public function stored($array)
    {
        $rolePermission = new RolePermission();

        $rolePermission->fill($array);
        $rolePermission->save();

        return $rolePermission;
    }

    public function getFromId($id)
    {
        return RolePermission::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $rolePermission = RolePermission::findOrFail($id);

        $rolePermission->fill($array);
        $rolePermission->save();

        return $rolePermission;
    }

    public function deleted($roleId)
    {
        return RolePermission::where('role_id', $roleId)->forceDelete();
    }
}
