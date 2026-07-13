<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LogGudangController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/log-gudang', [LogGudangController::class, 'index'])->name('gudang.index');

    Route::prefix('log-gudang')->name('log-gudang.')->group(function () {
        Route::post('/masuk', [LogGudangController::class, 'storeMasuk'])->name('masuk.store');
        Route::put('/masuk/{logMasuk}', [LogGudangController::class, 'updateMasuk'])->name('masuk.update');
        Route::delete('/masuk/{logMasuk}', [LogGudangController::class, 'destroyMasuk'])->name('masuk.destroy');

        Route::post('/keluar', [LogGudangController::class, 'storeKeluar'])->name('keluar.store');
        Route::put('/keluar/{logKeluar}', [LogGudangController::class, 'updateKeluar'])->name('keluar.update');
        Route::delete('/keluar/{logKeluar}', [LogGudangController::class, 'destroyKeluar'])->name('keluar.destroy');
    });
});


require __DIR__.'/auth.php';
