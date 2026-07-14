<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\StandarProgressController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LogGudangController;
use App\Http\Controllers\UserRoleController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:Super Admin|Admin'])->group(function () {
    Route::resource('material', MaterialController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->parameters(['material' => 'material']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/unit', [UnitController::class, 'index'])->name('unit.index');
    Route::post('/unit', [UnitController::class, 'store'])->name('unit.store');
    Route::put('/unit/{unit}', [UnitController::class, 'update'])->name('unit.update');
    Route::delete('/unit/{unit}', [UnitController::class, 'destroy'])->name('unit.destroy');
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

Route::middleware('auth')->group(function () {
    Route::get('/standar', [StandarProgressController::class, 'index'])->name('standar.index');
    Route::post('/standar', [StandarProgressController::class, 'store'])->name('standar.store');
    Route::put('/standar/{matrix}', [StandarProgressController::class, 'update'])->name('standar.update');
    Route::delete('/standar/{matrix}', [StandarProgressController::class, 'destroy'])->name('standar.destroy');
    Route::post('/standar/{matrix}/detail', [StandarProgressController::class, 'storeDetail'])->name('standar.detail.store');
    Route::put('/standar-detail/{detail}', [StandarProgressController::class, 'updateDetail'])->name('standar.detail.update');
    Route::delete('/standar-detail/{detail}', [StandarProgressController::class, 'destroyDetail'])->name('standar.detail.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/user-role', [UserRoleController::class, 'index'])->name('users.index');
    Route::get('/user-role/create', [UserRoleController::class, 'create'])->name('users.create');
    Route::post('/user-role', [UserRoleController::class, 'store'])->name('users.store');
    Route::get('/user-role/{user}/edit', [UserRoleController::class, 'edit'])->name('users.edit');
    Route::put('/user-role/{user}', [UserRoleController::class, 'update'])->name('users.update');
    Route::patch('/users/{user}/toggle', [UserRoleController::class, 'toggleStatus'])->name('users.toggle');
    Route::delete('/user-role/{user}', [UserRoleController::class, 'destroy'])->name('users.destroy');
});

require __DIR__.'/auth.php';