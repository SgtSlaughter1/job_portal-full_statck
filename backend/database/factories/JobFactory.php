<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\Employer;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobFactory extends Factory
{
    protected $model = Job::class;

    public function definition(): array
    {
        $jobTitles = [
            'Senior Software Engineer',
            'Full Stack Developer',
            'DevOps Engineer',
            'Product Manager',
            'UI/UX Designer',
            'Data Scientist',
            'Cloud Architect',
            'Mobile App Developer',
            'Frontend Developer',
            'Backend Developer'
        ];

        $requirements = [
            ['PHP', 'Laravel', 'MySQL', 'Vue.js', 'Git'],
            ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
            ['Python', 'Django', 'PostgreSQL', 'Docker', 'Linux'],
            ['Java', 'Spring Boot', 'Oracle', 'Angular', 'Jenkins'],
            ['C#', '.NET Core', 'SQL Server', 'Azure', 'TypeScript']
        ];

        $responsibilities = [
            [
                'Lead development team',
                'Design system architecture',
                'Code review',
                'Mentor junior developers',
                'Collaborate with stakeholders'
            ],
            [
                'Develop new features',
                'Write clean, maintainable code',
                'Debug and fix issues',
                'Write technical documentation',
                'Participate in code reviews'
            ],
            [
                'Optimize application performance',
                'Implement security measures',
                'Database design and optimization',
                'API development',
                'Unit testing'
            ]
        ];

        $experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead'];
        $types = ['full-time', 'part-time', 'contract'];

        return [
            'employer_id' => Employer::factory(),
            'title' => fake()->randomElement($jobTitles),
            'description' => fake()->paragraphs(3, true),
            'location' => fake()->city() . ', ' . fake()->stateAbbr(),
            'type' => fake()->randomElement($types),
            'salary' => fake()->numberBetween(50000, 150000),
            'experience_level' => fake()->randomElement($experienceLevels),
            'requirements' => fake()->randomElement($requirements),
            'responsibilities' => fake()->randomElement($responsibilities),
            'is_active' => true,
            'deadline' => fake()->dateTimeBetween('+1 week', '+2 months'),
        ];
    }
}
