<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class JobSeeker extends Authenticatable
{
    use HasFactory;
    use HasApiTokens;
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'bio',
        'resume_url',
        'skills',
        'education_level',
        'experience_years',
        'current_position',
        'expected_salary',
        'is_available'
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'updated_at'
    ];

    protected $casts = [
        'skills' => 'array',
        'experience_years' => 'integer',
        'expected_salary' => 'integer',
        'is_available' => 'boolean',
        'email_verified_at' => 'datetime'
    ];

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
