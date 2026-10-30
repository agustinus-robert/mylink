<?php

use Illuminate\Support\Facades\Route;
use Modules\Front\Controllers\HomeController;
use Modules\Front\Controllers\TopicController;


Route::get('/beranda', [HomeController::class, 'index'])->name('home');
Route::get('/topik', [TopicController::class, 'index'])->name('topik');

Route::get('/', function () {
    return redirect()->route('home');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__ . '/settings.php';
