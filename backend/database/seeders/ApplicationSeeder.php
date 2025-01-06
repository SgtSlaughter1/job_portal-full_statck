<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\JobSeeker;
use App\Models\Application;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        // Each job seeker applies to 2-6 random jobs
        JobSeeker::all()->each(function ($jobSeeker) {
            $jobs = Job::inRandomOrder()->take(rand(2, 6))->get();
            
            foreach ($jobs as $job) {
                Application::factory()->create([
                    'job_id' => $job->id,
                    'job_seeker_id' => $jobSeeker->id
                ]);
            }
        });
    }
}
