<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stage_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stage_id')->constrained('progress_stages')->onDelete('cascade');
            $table->string('material_code', 50);
            $table->decimal('std_qty', 12, 2);
            $table->timestamps();

            $table->foreign('material_code')->references('code')->on('materials')->onDelete('cascade');
            $table->unique(['stage_id', 'material_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stage_materials');
    }
};
