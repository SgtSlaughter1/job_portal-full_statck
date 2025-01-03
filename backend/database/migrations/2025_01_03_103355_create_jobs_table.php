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
            $table->string('jobTitle');
            $table->string('company');
            $table->string('location');
            $table->string('pay');
            $table->text('description');
            $table->json('requirements');
            $table->json('responsibilities');
            $table->string('employmentType');
            $table->string('experienceLevel');
            $table->date('postedDate');
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
