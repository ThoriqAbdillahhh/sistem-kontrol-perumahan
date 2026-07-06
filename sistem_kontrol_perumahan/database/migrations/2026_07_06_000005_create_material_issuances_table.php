<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('material_issuances', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('unit_code', 50);
            $table->string('material_code', 50);
            $table->decimal('qty', 12, 2);
            $table->decimal('unit_price', 15, 2)->default(0.00);  // Harga Satuan saat Keluar
            $table->decimal('total_price', 15, 2)->default(0.00); // Total Nilai Keluar
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('unit_code')->references('code')->on('units')->onDelete('cascade');
            $table->foreign('material_code')->references('code')->on('materials')->onDelete('cascade');
            
            $table->index(['unit_code', 'material_code']);
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_issuances');
    }
};
