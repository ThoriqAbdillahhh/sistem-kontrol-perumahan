<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {

            $table->id();

            // Data User
            $table->string('name',100);
            $table->string('username',50)->unique();
            $table->string('email',150)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();

            // Laravel
            $table->rememberToken();
            $table->timestamps();

            // Index
            $table->index('username');
            $table->index('email');

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};