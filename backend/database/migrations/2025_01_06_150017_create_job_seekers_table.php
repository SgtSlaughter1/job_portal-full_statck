<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_seekers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->string('resume_url')->nullable();
            $table->json('skills')->nullable();
            $table->string('education_level');
            $table->integer('experience_years')->default(0);
            $table->string('current_position')->nullable();
            $table->integer('expected_salary')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_seekers');
    }
};
