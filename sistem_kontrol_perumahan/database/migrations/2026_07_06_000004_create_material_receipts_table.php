<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('material_receipts', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('supplier', 255)->nullable();
            $table->string('material_code', 50);
            $table->decimal('qty', 12, 2);
            $table->decimal('unit_price', 15, 2);
            $table->decimal('total_price', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('material_code')->references('code')->on('materials')->onDelete('cascade');
            $table->index(['material_code', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_receipts');
    }
};
