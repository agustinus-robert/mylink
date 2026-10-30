<?php

use Illuminate\Support\Facades\Route;

Route::prefix('{{ route }}')
    ->middleware('api')
    ->group(function () {

    });