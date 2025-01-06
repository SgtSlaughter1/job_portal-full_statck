<?php

namespace Database\Factories;

use App\Models\Employer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jobs = [
            [
                'title' => 'Senior Software Engineer',
                'description' => 'We are looking for an experienced software engineer...',
                'location' => 'Lagos, Nigeria',
                'type' => 'Full-time',
                'salary' => '$120,000 - $150,000',
                'experience_level' => 'Senior',
                'requirements' => [
                    '5+ years of experience with JavaScript',
                    'Experience with Vue.js',
                    'Strong problem-solving skills'
                ],
                'responsibilities' => [
                    'Develop new features for our platform',
                    'Mentor junior developers',
                    'Participate in code reviews'
                ],
                'posted_date' => '2024-03-15',
            ],
            [
                'title' => 'Product Manager',
                'description' => 'Seeking a product manager to lead our product development...',
                'location' => 'Abuja, Nigeria',
                'type' => 'Full-time',
                'salary' => '$80,000 - $100,000',
                'experience_level' => 'Mid-level',
                'requirements' => [
                    '3+ years of experience in product management',
                    'Strong analytical skills',
                    'Excellent communication skills'
                ],
                'responsibilities' => [
                    'Define product vision and strategy',
                    'Collaborate with cross-functional teams',
                    'Analyze market trends and customer feedback'
                ],
                'posted_date' => '2024-03-10',
            ],
            [
                'title' => 'Data Scientist',
                'description' => 'We are looking for a data scientist to join our team...',
                'location' => 'Accra, Ghana',
                'type' => 'Full-time',
                'salary' => '$90,000 - $110,000',
                'experience_level' => 'Mid-level',
                'requirements' => [
                    '3+ years of experience in data science',
                    'Proficiency in Python and R',
                    'Strong analytical skills'
                ],
                'responsibilities' => [
                    'Analyze complex data sets',
                    'Develop predictive models',
                    'Collaborate with stakeholders to implement data-driven solutions'
                ],
                'posted_date' => '2024-03-05',
            ],
            [
                'title' => 'UX/UI Designer',
                'description' => 'Join our team as a UX/UI Designer to create user-friendly interfaces...',
                'location' => 'Lagos, Nigeria',
                'type' => 'Full-time',
                'salary' => '$60,000 - $80,000',
                'experience_level' => 'Mid-level',
                'requirements' => [
                    'Experience with design software (Figma, Sketch)',
                    'Strong portfolio of design projects',
                    'Understanding of user-centered design principles'
                ],
                'responsibilities' => [
                    'Design user interfaces for web and mobile applications',
                    'Conduct user research and testing',
                    'Collaborate with developers to implement designs'
                ],
                'posted_date' => '2024-03-01',
            ],
            [
                'title' => 'Marketing Specialist',
                'description' => 'We are looking for a marketing specialist to develop and execute marketing strategies...',
                'location' => 'Lagos, Nigeria',
                'type' => 'Part-time',
                'salary' => '$40,000 - $60,000',
                'experience_level' => 'Entry-level',
                'requirements' => [
                    '2+ years of experience in marketing',
                    'Strong understanding of digital marketing',
                    'Excellent written and verbal communication skills'
                ],
                'responsibilities' => [
                    'Create marketing campaigns',
                    'Analyze market trends',
                    'Manage social media accounts'
                ],
                'posted_date' => '2024-02-25',
            ],
            [
                'title' => 'Sales Executive',
                'description' => 'Looking for a motivated sales executive to drive sales...',
                'location' => 'Lagos, Nigeria',
                'type' => 'Full-time',
                'salary' => '$30,000 - $50,000',
                'experience_level' => 'Mid-level',
                'requirements' => [
                    'Proven experience in sales',
                    'Excellent negotiation skills',
                    'Ability to work independently'
                ],
                'responsibilities' => [
                    'Identify and pursue new sales opportunities',
                    'Build and maintain client relationships',
                    'Achieve sales targets'
                ],
                'posted_date' => '2024-02-20',
            ],
            [
                'title' => 'Software Tester',
                'description' => 'We are seeking a detail-oriented software tester...',
                'location' => 'Abuja, Nigeria',
                'type' => 'Contract',
                'salary' => '$40,000 - $60,000',
                'experience_level' => 'Entry-level',
                'requirements' => [
                    'Experience with automated testing tools',
                    'Strong analytical skills',
                    'Ability to work in a team'
                ],
                'responsibilities' => [
                    'Develop and execute test plans',
                    'Identify and document defects',
                    'Collaborate with developers to resolve issues'
                ],
                'posted_date' => '2024-02-18',
            ],
            [
                'title' => 'Graphic Designer',
                'description' => 'Join our creative team as a graphic designer...',
                'location' => 'Lagos, Nigeria',
                'type' => 'Full-time',
                'salary' => '$35,000 - $55,000',
                'experience_level' => 'Mid-level',
                'requirements' => [
                    'Proficiency in Adobe Creative Suite',
                    'Strong portfolio of design work',
                    'Creativity and attention to detail'
                ],
                'responsibilities' => [
                    'Create visual content for marketing campaigns',
                    'Collaborate with the marketing team',
                    'Ensure brand consistency'
                ],
                'posted_date' => '2024-02-15',
            ],
            [
                'title' => 'Content Writer',
                'description' => 'We are looking for a talented content writer...',
                'location' => 'Lagos, Nigeria',
                'type' => 'Part-time',
                'salary' => '$25,000 - $45,000',
                'experience_level' => 'Entry-level',
                'requirements' => [
                    'Excellent writing and editing skills',
                    'Experience with SEO',
                    'Ability to meet deadlines'
                ],
                'responsibilities' => [
                    'Create engaging content for blogs and websites',
                    'Research industry-related topics',
                    'Collaborate with the marketing team'
                ],
                'posted_date' => '2024-02-10',
            ],
            [
                'title' => 'HR Manager',
                'description' => 'Seeking an experienced HR manager to oversee HR functions...',
                'location' => 'Abuja, Nigeria',
                'type' => 'Full-time',
                'salary' => '$70,000 - $90,000',
                'experience_level' => 'Senior',
                'requirements' => [
                    '5+ years of experience in HR',
                    'Strong knowledge of labor laws',
                    'Excellent interpersonal skills'
                ],
                'responsibilities' => [
                    'Manage recruitment and selection processes',
                    'Develop HR policies and procedures',
                    'Oversee employee relations'
                ],
                'posted_date' => '2024-02-05',
            ],
        ];

        $job = $this->faker->randomElement($jobs); // Select a random job

        return [
            'employer_id' => Employer::factory(),
            'title' => $job['title'],
            'description' => $job['description'],
            'location' => $job['location'],
            'type' => $job['type'],
            'salary' => $job['salary'],
            'experience_level' => $job['experience_level'],
            'requirements' => $job['requirements'],
            'responsibilities' => $job['responsibilities'],
            'is_active' => true, // Assuming all jobs are active
            'deadline' => $job['posted_date'],
        ];
    }
}
