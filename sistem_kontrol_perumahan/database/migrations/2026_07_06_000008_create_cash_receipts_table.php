<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_receipts', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('phase', 100);       // Tahap Penerimaan (e.g., Tahap 1)
            $table->text('description')->nullable();
            $table->decimal('amount', 15, 2);   // Nominal Masuk
            $table->string('source', 255);      // Dari (Owner/Investor, e.g., Pak Supri)
            $table->string('recipient', 255);   // Untuk/Penerima (e.g., Harry)
            $table->timestamp('created_at')->useCurrent();

            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_receipts');
    }
};
