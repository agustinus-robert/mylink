<?php

use Illuminate\Support\Facades\Route;
use Modules\Master\Controllers\SubCategoryController;
use Modules\Master\Controllers\CoreTagController;
use Modules\Master\Controllers\CategoryController;
use Modules\Master\Controllers\TagController;
use Modules\Master\Controllers\LanguageController;

Route::middleware(['web', 'auth'])
    ->prefix('master')
    ->as('master.')
    ->group(function () {
        Route::resource('core-tag', CoreTagController::class);
        Route::resource('category', CategoryController::class);
        Route::resource('sub-category', SubCategoryController::class);
        Route::resource('tag', TagController::class);
        Route::resource('language', LanguageController::class);
    });
