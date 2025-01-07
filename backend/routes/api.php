<?php

use App\Http\Controllers\JobsController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Test route
Route::get('/test', function() {
    return response()->json(['message' => 'API is working!']);
});

// Public routes
Route::get('/jobs', [JobsController::class, 'index'])->name('jobs.index');
Route::get('/jobs/{id}', [JobsController::class, 'show'])->name('jobs.show');

// Authentication routes
Route::post('/employer/register', [AuthController::class, 'employerRegister']);
Route::post('/employer/login', [AuthController::class, 'employerLogin']);
Route::post('/jobseeker/register', [AuthController::class, 'jobSeekerRegister']);
Route::post('/jobseeker/login', [AuthController::class, 'jobSeekerLogin']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/jobs', [JobsController::class, 'store'])->name('jobs.store');
    Route::put('/jobs/{id}', [JobsController::class, 'update'])->name('jobs.update');
    Route::delete('/jobs/{id}', [JobsController::class, 'destroy'])->name('jobs.destroy');
});