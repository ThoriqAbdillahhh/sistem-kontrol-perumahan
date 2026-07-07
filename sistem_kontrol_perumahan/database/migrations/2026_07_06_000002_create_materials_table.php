<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->string('code', 50)->primary();       // Kode Material (e.g., MT001)
            $table->string('name', 255)->unique();       // Nama Material (e.g., Semen)
            $table->string('unit', 50);                  // Satuan (e.g., Zak, Rit)
            $table->string('category', 100)->nullable(); // Kategori (e.g., Struktur)
            $table->decimal('price', 15, 2)->default(0.00); // Harga Acuan
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
