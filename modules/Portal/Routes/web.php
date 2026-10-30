<?php

use Illuminate\Support\Facades\Route;
use Modules\Portal\Controllers\PortalController;

Route::middleware('web')
    ->prefix('portal')
    ->as('portal.')
    ->group(function () {

       Route::get('/dashboard-test', [PortalController::class, 'index'])->name('portal.dashboard');
    });