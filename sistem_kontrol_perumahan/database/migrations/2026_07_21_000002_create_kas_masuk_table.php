<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kas_masuk', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->foreignId('akun_id')
                ->constrained('master_akun')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->decimal('nominal', 15, 2);
            $table->text('keterangan')->nullable();
            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->timestamps();

            $table->index(['akun_id', 'tanggal']);
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kas_masuk');
    }
};
