
#### `routes/api.php`
```php
<?php

use App\Http\Controllers\JobsController;
use Illuminate\Support\Facades\Route;

/**
 * API Routes for Job Listings
 */

// Retrieve all job listings
Route::get('/jobs', [JobsController::class, 'index'])
    ->name('jobs.index') // Named route for easier reference
    ->middleware('auth:sanctum'); // Apply authentication middleware if needed

// Retrieve a specific job listing by ID
Route::get('/jobs/{id}', [JobsController::class, 'show'])
    ->name('jobs.show') // Named route for easier reference
    ->middleware('auth:sanctum'); // Apply authentication middleware if needed

// Create a new job listing
Route::post('/jobs', [JobsController::class, 'store'])
    ->name('jobs.store') // Named route for easier reference
    ->middleware('auth:sanctum'); // Apply authentication middleware if needed

// Update an existing job listing by ID
Route::put('/jobs/{id}', [JobsController::class, 'update'])
    ->name('jobs.update') // Named route for easier reference
    ->middleware('auth:sanctum'); // Apply authentication middleware if needed

// Delete a specific job listing by ID
Route::delete('/jobs/{id}', [JobsController::class, 'destroy'])
    ->name('jobs.destroy') // Named route for easier reference
    ->middleware('auth:sanctum'); // Apply authentication middleware if needed 