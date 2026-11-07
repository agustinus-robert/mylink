<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\Account\Database\Seeders\RoleSeeders;
use Modules\Account\Database\Seeders\PermissionSeeders;
use Modules\Account\Database\Seeders\RolePermissionSeeders;
use Modules\Account\Database\Seeders\RoleUserSeeders;
use Modules\Master\Database\Seeders\ProvinceSeeder;
use Modules\Master\Database\Seeders\RegencySeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'operator1@example.com'],
            [
                'name' => 'Operator 1',
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'operator2@example.com'],
            [
                'name' => 'Operator 2',
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'operator3@example.com'],
            [
                'name' => 'Operator 3',
                'password' => Hash::make('password'),
            ]
        );

        $this->call([
            RoleSeeders::class,
            PermissionSeeders::class,
            RolePermissionSeeders::class,
            RoleUserSeeders::class
        ]);
    }
}
