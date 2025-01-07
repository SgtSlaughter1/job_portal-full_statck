<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Employer;
use App\Models\Application;
use Carbon\Carbon;

class Job extends Model
{
    use HasFactory;

    protected $table = 'jobs';

    protected $fillable = [
        'title',
        'description',
        'location',
        'type',
        'salary',
        'experience_level',
        'requirements',
        'responsibilities',
        'deadline',
        'is_active',
        'employer_id',
    ];

    protected $casts = [
        'requirements' => 'array',
        'responsibilities' => 'array',
        'deadline' => 'datetime',
        'is_active' => 'boolean',
        'salary' => 'integer',
    ];

    protected $hidden = ['updated_at'];

    protected $appends = ['created_date', 'deadline_date'];

    protected $with = ['employer'];

    /**
     * Get the employer that owns the job.
     */
    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    /**
     * Get the applications for the job.
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Get formatted created date
     */
    public function getCreatedDateAttribute()
    {
        return Carbon::parse($this->created_at)->format('M d, Y');
    }

    /**
     * Get formatted deadline date
     */
    public function getDeadlineDateAttribute()
    {
        return Carbon::parse($this->deadline)->format('M d, Y');
    }
}
