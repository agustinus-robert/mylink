<?php

namespace Modules\Account\Database\Seeders;

use Modules\Account\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeders extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Mengelola data dan operasional aplikasi.',
            ],
            [
                'name' => 'Operator',
                'slug' => 'operator',
                'description' => 'Menjalankan transaksi dan aktivitas operasional.',
            ],
        ];

        foreach ($roles as $data) {
            Role::withTrashed()->updateOrCreate(
                ['name' => $data['name']],
                [
                    ...$data,
                    'deleted_at' => null,
                ]
            );
        }
    }
}
