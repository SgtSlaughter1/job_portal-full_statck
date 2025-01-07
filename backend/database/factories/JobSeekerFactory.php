<?php

namespace Database\Factories;

use App\Models\JobSeeker;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobSeeker>
 */
class JobSeekerFactory extends Factory
{
    protected $model = JobSeeker::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $skills = [
            ['PHP', 'Laravel', 'MySQL', 'Vue.js', 'Git'],
            ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
            ['Python', 'Django', 'PostgreSQL', 'Docker', 'Linux'],
            ['Java', 'Spring Boot', 'Oracle', 'Angular', 'Jenkins'],
            ['C#', '.NET Core', 'SQL Server', 'Azure', 'TypeScript']
        ];

        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password123'),
            'phone' => fake()->phoneNumber(),
            'resume_url' => null,
            'skills' => fake()->randomElement($skills),
            'experience_years' => fake()->numberBetween(1, 15),
            'education_level' => fake()->randomElement(['Bachelor', 'Master', 'PhD']),
            'current_position' => fake()->jobTitle(),
            'expected_salary' => fake()->numberBetween(50000, 150000),
            'is_available' => true,
        ];
    }
}
