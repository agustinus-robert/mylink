<?php

namespace Modules\Account\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Modules\Account\Models\Role;

class RoleUserSeeders extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'email' => 'admin@example.com',
                'role' => 'admin',
            ],
            [
                'email' => 'operator1@example.com',
                'role' => 'operator',
            ],
            [
                'email' => 'operator2@example.com',
                'role' => 'operator',
            ],
            [
                'email' => 'operator3@example.com',
                'role' => 'operator',
            ],
        ];

        foreach ($users as $data) {
            $user = User::query()
                ->where('email', $data['email'])
                ->first();

            $role = Role::query()
                ->where('slug', $data['role'])
                ->first();

            if (! $user || ! $role) {
                continue;
            }

            $role->users()->syncWithoutDetaching([
                $user->id,
            ]);
        }
    }
}
