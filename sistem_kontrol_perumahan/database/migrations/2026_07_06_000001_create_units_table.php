<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->string('code', 50)->primary(); // Kode Unit (e.g., A1, C5, Infrastruktur)
            $table->string('zone', 50);            // Zona/Cluster (e.g., A, C, Umum)
            $table->string('status', 20)->default('Aktif'); // Status ('Aktif', 'Non Aktif')
            $table->string('worker', 100)->nullable();     // Nama Tukang
            $table->date('start_date')->nullable();        // Tanggal Mulai Pengerjaan
            $table->text('description')->nullable();       // Keterangan
            $table->decimal('progress_percent', 5, 2)->default(0.00); // Progress (0-100)
            $table->timestamp('last_update')->useCurrent(); // Waktu Update Progress Terakhir
            $table->timestamps();

            $table->index(['zone', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
