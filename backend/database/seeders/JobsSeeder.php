<?php

namespace Database\Seeders;

use App\Models\Jobs;
use Illuminate\Database\Seeder;

class JobsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This method creates 50 fake job entries in the 'jobs' table.
     */
    public function run()
    {
        Jobs::factory()->count(50)->create();
    }
}
