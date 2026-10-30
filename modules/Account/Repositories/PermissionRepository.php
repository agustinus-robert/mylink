<?php

namespace Modules\Account\Repositories;

use Modules\Account\Models\Permission;

class PermissionRepository
{
    public function paginate(array $filters)
    {
        return Permission::query()
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
        $permission = new Permission();

        $permission->fill($array);
        $permission->save();

        return $permission;
    }

    public function getFromId($id)
    {
        return Permission::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $permission = Permission::findOrFail($id);

        $permission->fill($array);
        $permission->save();

        return $permission;
    }

    public function deleted($id)
    {
        $permission = Permission::findOrFail($id);

        return $permission->delete();
    }
}
