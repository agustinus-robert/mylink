<?php

namespace Modules\Account\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Account\Models\Permission;
use Illuminate\Support\Facades\DB;

class PermissionSeeders extends Seeder
{
    public function run(): void
    {
        $permissions = [
            [
                'name' => 'Lihat Dashboard',
                'slug' => 'dashboard.view',
                'group' => 'Dashboard',
                'description' => 'Melihat halaman dashboard.',
            ],

            [
                'name' => 'Lihat Pengguna',
                'slug' => 'user.view',
                'group' => 'Pengguna',
                'description' => 'Melihat daftar pengguna.',
            ],
            [
                'name' => 'Tambah Pengguna',
                'slug' => 'user.create',
                'group' => 'Pengguna',
                'description' => 'Menambahkan pengguna baru.',
            ],
            [
                'name' => 'Ubah Pengguna',
                'slug' => 'user.update',
                'group' => 'Pengguna',
                'description' => 'Mengubah data pengguna.',
            ],
            [
                'name' => 'Hapus Pengguna',
                'slug' => 'user.delete',
                'group' => 'Pengguna',
                'description' => 'Menghapus pengguna.',
            ],

            [
                'name' => 'Lihat Role',
                'slug' => 'role.view',
                'group' => 'Role',
                'description' => 'Melihat daftar role.',
            ],
            [
                'name' => 'Tambah Role',
                'slug' => 'role.create',
                'group' => 'Role',
                'description' => 'Menambahkan role baru.',
            ],
            [
                'name' => 'Ubah Role',
                'slug' => 'role.update',
                'group' => 'Role',
                'description' => 'Mengubah data role.',
            ],
            [
                'name' => 'Hapus Role',
                'slug' => 'role.delete',
                'group' => 'Role',
                'description' => 'Menghapus role.',
            ],

            [
                'name' => 'Lihat Permission',
                'slug' => 'permission.view',
                'group' => 'Permission',
                'description' => 'Melihat daftar permission.',
            ],
            [
                'name' => 'Kelola Permission',
                'slug' => 'permission.manage',
                'group' => 'Permission',
                'description' => 'Mengelola permission aplikasi.',
            ],

            [
                'name' => 'Lihat Kategori',
                'slug' => 'category.view',
                'group' => 'Master',
                'description' => 'Melihat data kategori.',
            ],
            [
                'name' => 'Tambah Kategori',
                'slug' => 'category.create',
                'group' => 'Master',
                'description' => 'Menambahkan kategori.',
            ],
            [
                'name' => 'Ubah Kategori',
                'slug' => 'category.update',
                'group' => 'Master',
                'description' => 'Mengubah kategori.',
            ],
            [
                'name' => 'Hapus Kategori',
                'slug' => 'category.delete',
                'group' => 'Master',
                'description' => 'Menghapus kategori.',
            ],

            [
                'name' => 'Lihat Barang Masuk',
                'slug' => 'incoming.view',
                'group' => 'Transaksi',
                'description' => 'Melihat transaksi barang masuk.',
            ],
            [
                'name' => 'Tambah Barang Masuk',
                'slug' => 'incoming.create',
                'group' => 'Transaksi',
                'description' => 'Membuat transaksi barang masuk.',
            ],
            [
                'name' => 'Ubah Barang Masuk',
                'slug' => 'incoming.update',
                'group' => 'Transaksi',
                'description' => 'Mengubah transaksi barang masuk.',
            ],
            [
                'name' => 'Hapus Barang Masuk',
                'slug' => 'incoming.delete',
                'group' => 'Transaksi',
                'description' => 'Menghapus transaksi barang masuk.',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::withTrashed()->updateOrCreate(
                ['slug' => $permission['slug']],
                [
                    ...$permission,
                    'description' => null,
                    'deleted_at' => null,
                ]
            );
        }
    }
}