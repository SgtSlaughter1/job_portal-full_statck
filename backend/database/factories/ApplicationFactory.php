<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\JobSeeker;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
        
        return [
            'job_id' => Job::factory(),
            'job_seeker_id' => JobSeeker::factory(),
            'cover_letter' => fake()->paragraphs(3, true),
            'resume_url' => fake()->url(),
            'status' => fake()->randomElement($statuses),
            'employer_notes' => fake()->boolean(30) ? fake()->paragraph() : null, // 30% chance of having notes
        ];
    }
}
