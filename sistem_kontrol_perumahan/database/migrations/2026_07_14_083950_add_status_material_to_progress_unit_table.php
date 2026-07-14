<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('progress_unit', function (Blueprint $table) {
            $table->string('status_material')->nullable()->after('status');
            $table->json('detail_material')->nullable()->after('status_material');
        });
    }

    public function down(): void
    {
        Schema::table('progress_unit', function (Blueprint $table) {
        $table->dropColumn(['status_material', 'detail_material']);
    });
}
};
