<?php

use Illuminate\Support\Facades\Route;

Route::middleware('web')
    ->prefix('{{Route}}')
    ->as('{{module}}.')
    ->group(function () {

        Route::get('/', function () {
            return '{{Module}} Module';
        })->name('index');

    });