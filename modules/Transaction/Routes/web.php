<?php

use Illuminate\Support\Facades\Route;
use Modules\Transaction\Controllers\IncomingController;

Route::middleware('web')
    ->prefix('transaction')
    ->as('transaction.')
    ->group(function () {
        Route::get('incoming/export', [IncomingController::class, 'export'])
            ->name('incoming.export');

        Route::post('incoming/{incoming}/verify', [IncomingController::class, 'verify'])
            ->name('incoming.verify');

        Route::get('incoming/{incoming}/receipt', [IncomingController::class, 'receipt'])
            ->name('incoming.receipt');

        Route::resource('incoming', IncomingController::class);
    });