<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MaterialController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UnitController;
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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('material', MaterialController::class)
        ->only(['index', 'store', 'update', 'destroy']);
});

Route::middleware(['auth', 'role:Super Admin|Admin'])->group(function () {
    Route::resource('material', MaterialController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->parameters(['material' => 'material']);
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/unit', [UnitController::class, 'index'])->name('unit.index');
    Route::post('/unit', [UnitController::class, 'store'])->name('unit.store');
    Route::put('/unit/{unit}', [UnitController::class, 'update'])->name('unit.update');
    Route::delete('/unit/{unit}', [UnitController::class, 'destroy'])->name('unit.destroy');
    // TODO: tambah middleware role setelah disepakati sama Orang A, misal ->middleware('role:Admin|Super Admin')
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/log-gudang', [LogGudangController::class, 'index']);
    Route::post('/log-gudang/masuk', [LogGudangController::class, 'storeMasuk']);
    Route::post('/log-gudang/keluar', [LogGudangController::class, 'storeKeluar']);
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
