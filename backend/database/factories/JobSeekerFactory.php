<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobSeeker>
 */
class JobSeekerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $educationLevels = ['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Associate Degree'];
        $fields = ['Computer Science', 'Business Administration', 'Engineering', 'Healthcare', 'Education', 'Marketing'];
        $jobTitles = ['Software Engineer', 'Project Manager', 'Data Analyst', 'Marketing Specialist', 'Teacher', 'Sales Representative'];
        $skills = [
            'JavaScript', 'Python', 'Java', 'SQL', 'React', 'Node.js', 'PHP', 'Laravel',
            'Project Management', 'Team Leadership', 'Communication', 'Problem Solving',
            'Marketing', 'Sales', 'Customer Service', 'Data Analysis'
        ];

        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'), // default password for testing
            'phone' => fake()->phoneNumber(),
            'bio' => fake()->paragraphs(2, true),
            'resume_url' => fake()->url(),
            'skills' => fake()->randomElements($skills, random_int(3, 8)),
            'education_level' => fake()->randomElement($educationLevels),
            'field_of_study' => fake()->randomElement($fields),
            'years_of_experience' => fake()->numberBetween(0, 15),
            'current_job_title' => fake()->randomElement($jobTitles),
            'location' => fake()->city() . ', ' . fake()->country(),
            'profile_picture' => fake()->imageUrl(200, 200, 'person'),
            'remember_token' => Str::random(10),
        ];
    }
}
