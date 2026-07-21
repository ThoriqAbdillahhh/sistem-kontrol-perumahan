<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('akun_referensis', function (Blueprint $table) {
            $table->enum('jenis', ['masuk', 'keluar'])->default('masuk')->after('kategori');
        });
    }

    public function down(): void
    {
        Schema::table('akun_referensis', function (Blueprint $table) {
            $table->dropColumn('jenis');
        });
    }
};
