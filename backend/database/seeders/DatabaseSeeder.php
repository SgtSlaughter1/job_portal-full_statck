<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employer;
use App\Models\Job;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a sample employer
        $employer = Employer::create([
            'company_name' => 'Tech Corporation',
            'email' => 'employer@techcorp.com',
            'password' => Hash::make('password123'),
            'phone' => '123-456-7890',
            'company_description' => 'A leading technology company',
            'website' => 'https://techcorp.com',
            'industry' => 'Technology',
            'location' => 'San Francisco, CA',
            'is_verified' => true,
        ]);

        // Create sample jobs
        $jobs = [
            [
                'title' => 'Senior Software Engineer',
                'description' => 'We are looking for an experienced software engineer to join our team.',
                'location' => 'New York, NY',
                'type' => 'full-time',
                'salary' => 120000,
                'experience_level' => 'Senior',
                'requirements' => ['PHP', 'Laravel', 'Vue.js', '5+ years experience'],
                'responsibilities' => ['Lead development team', 'Design system architecture', 'Code review'],
                'deadline' => now()->addMonths(1),
                'is_active' => true,
                'employer_id' => $employer->id,
            ],
            [
                'title' => 'Frontend Developer',
                'description' => 'Join our frontend team to build beautiful user interfaces.',
                'location' => 'Remote',
                'type' => 'full-time',
                'salary' => 90000,
                'experience_level' => 'Mid-Level',
                'requirements' => ['JavaScript', 'React', 'CSS', '3+ years experience'],
                'responsibilities' => ['Build UI components', 'Optimize performance', 'Mobile-first development'],
                'deadline' => now()->addMonths(1),
                'is_active' => true,
                'employer_id' => $employer->id,
            ],
            [
                'title' => 'DevOps Engineer',
                'description' => 'Help us build and maintain our cloud infrastructure.',
                'location' => 'San Francisco, CA',
                'type' => 'full-time',
                'salary' => 130000,
                'experience_level' => 'Senior',
                'requirements' => ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
                'responsibilities' => ['Manage cloud infrastructure', 'Implement CI/CD', 'System monitoring'],
                'deadline' => now()->addMonths(1),
                'is_active' => true,
                'employer_id' => $employer->id,
            ],
        ];

        foreach ($jobs as $job) {
            Job::create($job);
        }
    }
}
