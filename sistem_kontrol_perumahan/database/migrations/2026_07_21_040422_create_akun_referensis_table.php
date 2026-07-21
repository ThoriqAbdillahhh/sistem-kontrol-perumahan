<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('akun_referensis', function (Blueprint $table) {
            $table->id();
            $table->string('nama_akun');
            $table->enum('jenis', ['masuk', 'keluar']);
            $table->string('kategori')->nullable(); // opsional, misal "Operasional", "Modal"
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('akun_referensis');
    }
};