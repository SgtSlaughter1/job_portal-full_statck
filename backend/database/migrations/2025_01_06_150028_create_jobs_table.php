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
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employer_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->enum('type', ['full-time', 'part-time', 'contract']);
            $table->integer('salary')->nullable();
            $table->string('experience_level');
            $table->json('requirements');
            $table->json('responsibilities');
            $table->boolean('is_active')->default(true);
            $table->timestamp('deadline');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
