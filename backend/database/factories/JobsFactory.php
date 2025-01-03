<?php
namespace Database\Factories;

use App\Models\Jobs;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Class JobsFactory
 *
 * This factory generates fake data for the 'jobs' table.
 * It is used for testing and seeding the database.
 */

class JobsFactory extends Factory
{
    protected $model = Jobs::class;

    public function definition()
    {
        $employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
        $experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Lead'];

        return [
            'jobTitle' => $this->faker->jobTitle,
            'company' => $this->faker->company,
            'location' => $this->faker->city . ', ' . $this->faker->country,
            'pay' => '$' . $this->faker->numberBetween(40, 200) . 'k - $' . $this->faker->numberBetween(60, 250) . 'k',
            'description' => $this->faker->paragraphs(3, true),
            'requirements' => $this->faker->words(5),
            'responsibilities' => $this->faker->words(5),
            'employmentType' => $this->faker->randomElement($employmentTypes),
            'experienceLevel' => $this->faker->randomElement($experienceLevels),
            'postedDate' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
