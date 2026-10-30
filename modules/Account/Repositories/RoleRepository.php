<?php

namespace Modules\Account\Repositories;

use Modules\Account\Models\Role;

class RoleRepository
{
    public function paginate(array $filters)
    {
        return Role::query()
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
        $role = new Role();

        $role->fill($array);
        $role->save();

        return $role;
    }

    public function getFromId($id)
    {
        return Role::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $role = Role::findOrFail($id);

        $role->fill($array);
        $role->save();

        return $role;
    }

    public function deleted($id)
    {
        $role = Role::findOrFail($id);

        return $role->delete();
    }
}
