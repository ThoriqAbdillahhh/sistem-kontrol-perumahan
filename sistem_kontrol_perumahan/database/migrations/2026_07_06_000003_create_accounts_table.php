<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->string('code', 50)->primary();       // Kode Akun (e.g., 2001, 3001)
            $table->string('name', 255)->unique();       // Nama Akun (e.g., Material Proyek)
            $table->string('category', 50);              // Kategori Akun (e.g., HPP, OPEX)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
