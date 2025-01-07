<?php

namespace Database\Seeders;

use App\Models\Employer;
use App\Models\JobSeeker;
use App\Models\Job;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 5 employers
        $employers = Employer::factory(5)->create();

        // Create 5 job seekers
        JobSeeker::factory(5)->create();

        // Create 2-3 jobs for each employer (10-15 total jobs)
        foreach ($employers as $employer) {
            Job::factory(fake()->numberBetween(2, 3))->create([
                'employer_id' => $employer->id
            ]);
        }
    }
}
