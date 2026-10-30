<?php

use Illuminate\Support\Facades\Route;
use Modules\Account\Controllers\UserController;
use Modules\Account\Controllers\RoleController;
use Modules\Account\Controllers\PermissionController;
use Modules\Account\Controllers\RolePermissionController;

Route::middleware(['web', 'auth'])
    ->prefix('account')
    ->as('account.')
    ->group(function () {
        Route::resource('/user', UserController::class);
        Route::resource('/role', RoleController::class);
        Route::resource('/permission', PermissionController::class);

        Route::patch('/user/{user}/locked', [UserController::class, 'locked'])
            ->name('user.locked');

        Route::get(
            '/role-permission/{role}',
            [RolePermissionController::class, 'show']
        )->name('role-permission.show');

        Route::post(
            '/role-permission',
            [RolePermissionController::class, 'store']
        )->name('role-permission.store');
    });
