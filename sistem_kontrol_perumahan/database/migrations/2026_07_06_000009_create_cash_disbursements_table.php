<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_disbursements', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('account_code', 50);          // Kode Akun Pengeluaran
            $table->string('unit_code', 50)->nullable(); // Unit terkait (nullable)
            $table->text('description')->nullable();
            $table->decimal('qty', 12, 2)->nullable();
            $table->string('unit', 50)->nullable();
            $table->decimal('unit_price', 15, 2)->nullable();
            $table->decimal('amount', 15, 2);            // Total Nominal Pengeluaran
            $table->string('payment_method', 50)->default('Cash'); // Cash, Transfer, dll.
            $table->string('recipient', 255)->nullable();
            $table->string('receipt_no', 100)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('account_code')->references('code')->on('accounts')->onDelete('cascade');
            $table->foreign('unit_code')->references('code')->on('units')->onDelete('set null');
            
            $table->index('unit_code');
            $table->index('account_code');
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_disbursements');
    }
};
