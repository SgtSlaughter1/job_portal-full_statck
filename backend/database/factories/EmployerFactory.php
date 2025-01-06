<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employer>
 */
class EmployerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Construction'];
        
        return [
            'company_name' => fake()->company(),
            'email' => fake()->unique()->companyEmail(),
            'password' => Hash::make('password'), // default password for testing
            'phone' => fake()->phoneNumber(),
            'company_description' => fake()->paragraphs(2, true),
            'website' => fake()->url(),
            'industry' => fake()->randomElement($industries),
            'location' => fake()->city() . ', ' . fake()->country(),
            'logo_url' => fake()->imageUrl(200, 200, 'business'),
            'is_verified' => fake()->boolean(70), // 70% chance of being verified
            'remember_token' => Str::random(10),
        ];
    }
}
