<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Employer extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'company_name',
        'email',
        'password',
        'phone',
        'company_description',
        'website',
        'industry',
        'location',
        'logo_url',
        'is_verified',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'updated_at',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'email_verified_at' => 'datetime',
    ];

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }
}
