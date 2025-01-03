<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Jobs
 *
 * This model represents the 'jobs' table in the database.
 * It provides an interface for interacting with job listings.
 */

class Jobs extends Model
{
    use HasFactory;

    protected $fillable = [
        'jobTitle',
        'company',
        'location',
        'pay',
        'description',
        'requirements',
        'responsibilities',
        'employmentType',
        'experienceLevel',
        'postedDate'
    ];

    protected $casts = [
        'requirements' => 'array',
        'responsibilities' => 'array',
        'postedDate' => 'date'
    ];
}
