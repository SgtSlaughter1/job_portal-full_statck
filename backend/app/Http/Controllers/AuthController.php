<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employer;
use App\Models\JobSeeker;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function employerRegister(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:employers',
            'password' => 'required|string|min:8',
            'company_description' => 'required|string',
            'industry' => 'required|string',
            'location' => 'required|string',
        ]);

        $employer = Employer::create([
            'company_name' => $validated['company_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'company_description' => $validated['company_description'],
            'industry' => $validated['industry'],
            'location' => $validated['location'],
        ]);

        $token = $employer->createToken('auth_token')->plainTextToken;

        return response()->json([
            'employer' => $employer,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function employerLogin(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::guard('employer')->attempt($validated)) {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        $employer = Employer::where('email', $validated['email'])->firstOrFail();
        $token = $employer->createToken('auth_token')->plainTextToken;

        return response()->json([
            'employer' => $employer,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }


    public function jobSeekerRegister(Request $request)
    {
        try {
            // Debug the incoming request
            Log::info('Request data:', $request->all());

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:job_seekers',
                'password' => 'required|string|min:8',
                'education_level' => 'required|string',
                'phone' => 'required|string',
                'skills' => 'required|array',
                'years_of_experience' => 'required|integer',
                'location' => 'required|string',
                'password_confirmation' => 'required_with:password|same:password',
            ]);

            Log::info('Validated data:', $validated);

            $jobSeeker = JobSeeker::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'education_level' => $validated['education_level'],
                'phone' => $validated['phone'],
                'skills' => $validated['skills'],
                'years_of_experience' => $validated['years_of_experience'],
                'location' => $validated['location'],
            ]);

            // Generate token for authentication
            $token = $jobSeeker->createToken('auth_token')->plainTextToken;

            return response()->json([
                'job_seeker' => $jobSeeker,
                'token' => $token,
                'token_type' => 'Bearer',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
                'request_data' => $request->all(), // Add this to see what data is actually received
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }


    public function jobSeekerLogin(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::guard('job_seeker')->attempt($validated)) {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        $jobSeeker = JobSeeker::where('email', $validated['email'])->firstOrFail();
        $token = $jobSeeker->createToken('auth_token')->plainTextToken;

        return response()->json([
            'job_seeker' => $jobSeeker,
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
