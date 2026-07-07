<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('progress_stages', function (Blueprint $table) {
            $table->id();
            $table->integer('max_progress')->unique(); // Batas Atas Progress Persen
            $table->string('progress_range', 50);      // Label range (e.g., '0-5')
            $table->string('stage_name', 255);         // Tahap Pekerjaan (e.g., Pondasi)
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('progress_stages');
    }
};
