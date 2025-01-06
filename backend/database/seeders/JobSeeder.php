<?php

namespace Database\Seeders;

use App\Models\Job;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This method creates 50 fake job entries in the 'jobs' table.
     */
    public function run()
    {
        Job::factory()->count(50)->create();
    }
}
