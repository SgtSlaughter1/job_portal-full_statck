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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->references('id')->on('jobs')->onDelete('cascade');
            $table->foreignId('job_seeker_id')->constrained()->onDelete('cascade');
            $table->text('cover_letter')->nullable();
            $table->string('resume_url');
            $table->enum('status', ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'])->default('pending');
            $table->text('employer_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
