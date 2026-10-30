<?php

namespace Modules\Account\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Account\Models\Role;
use Modules\Account\Models\Permission;
use Modules\Account\Models\RolePermission;

class RolePermissionSeeders extends Seeder
{
    public function run(): void
    {
        $roles = Role::query()->get()->keyBy('slug');
        $permissions = Permission::query()->get();

        foreach ($permissions as $permission) {
            foreach ($roles as $role) {
                $allowed = match ($role->slug) {
                    'admin' => ! in_array($permission->slug, [
                        'permission.manage',
                    ], true),

                    'operator' => in_array($permission->slug, [
                        'dashboard.view',
                        'incoming.view',
                        'incoming.create',
                        'incoming.update',
                    ], true),

                    default => false,
                };

                if (! $allowed) {
                    continue;
                }

                RolePermission::withTrashed()->updateOrCreate(
                    [
                        'role_id' => $role->id,
                        'permission_id' => $permission->id,
                    ],
                    [
                        'deleted_at' => null,
                    ]
                );
            }
        }
    }
}