<?php

use Illuminate\Support\Facades\Route;
use Modules\Hotel\Controllers\DashboardController;
use Modules\Hotel\Controllers\Base\HotelController;
use Modules\Hotel\Controllers\Base\HotelBuildingController;
use Modules\Hotel\Controllers\Base\HotelFloorController;
use Modules\Hotel\Controllers\Company\DepartmentController;
use Modules\Hotel\Controllers\Company\StaffController;
use Modules\Hotel\Controllers\RoomAministies\AmnistiesController;

Route::middleware('web')
    ->prefix('hotel')
    ->as('hotel.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('index');
        Route::resource('/base-hotel', HotelController::class);
        Route::resource('/building', HotelBuildingController::class);
        Route::resource('/floor', HotelFloorController::class);
    });

Route::middleware('web')
    ->prefix('company')
    ->as('company.')
    ->group(function () {

        Route::resource('/department', DepartmentController::class);
        Route::resource('/staff', StaffController::class);
    });

Route::middleware('web')
    ->prefix('amenities-room')
    ->as('amenities-room.')
    ->group(function () {

        Route::resource('/amenities', AmnistiesController::class);
    });
