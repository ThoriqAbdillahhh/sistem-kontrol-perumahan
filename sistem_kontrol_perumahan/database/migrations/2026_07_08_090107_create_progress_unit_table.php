<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('progress_unit', function (Blueprint $table) {

            // Primary Key
            $table->id();

            // Unit yang dipantau
            $table->foreignId('unit_id')
                ->constrained('units')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Progress pembangunan (%)
            $table->decimal('progress_percent', 5, 2);

            // Tanggal update progress
            $table->date('tanggal_update');

            // Status pembangunan
            $table->enum('status', [
                'NOT STARTED',
                'ON PROGRESS',
                'DONE'
            ])->default('NOT STARTED');

            // User yang menginput progress
            $table->foreignId('updated_by')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Index
            |--------------------------------------------------------------------------
            */

            $table->index(['unit_id', 'tanggal_update']);
            $table->index('status');
            $table->index('updated_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progress_unit');
    }
};