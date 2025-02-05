<?php

namespace App\Providers;

use App\Models\Job;
use App\Policies\JobPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Job::class => JobPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define gates for employer-specific actions
        Gate::define('manage-jobs', function ($user) {
            return $user->role === 'employer';
        });

        Gate::define('manage-applications', function ($user) {
            return $user->role === 'employer';
        });
    }
}
