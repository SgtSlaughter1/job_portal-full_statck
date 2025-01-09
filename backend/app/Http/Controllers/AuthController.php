<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employer;
use App\Models\JobSeeker;
use Illuminate\Http\Request;
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
            'phone' => 'required|string|max:255',
            'company_size' => 'nullable|string|max:255',
            'industry' => 'required|string|max:255',
            'company_description' => 'required|string',
            'location' => 'required|string|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $employer = Employer::create([
            'company_name' => $validated['company_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company_description' => $validated['company_description'],
            'industry' => $validated['industry'],
            'location' => $validated['location'],
            'password' => Hash::make($validated['password']),
            'is_verified' => false,
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
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:job_seekers',
                'password' => 'required|string|min:8',
                'education_level' => 'required|string',
                'phone' => 'required|string',
                'skills' => 'required|array',
                'experience_years' => 'required|integer',
                'location' => 'required|string',
                'password_confirmation' => 'required_with:password|same:password',
            ]);

            $jobSeeker = JobSeeker::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'education_level' => $validated['education_level'],
                'phone' => $validated['phone'],
                'skills' => $validated['skills'],
                'experience_years' => $validated['experience_years'],
                'location' => $validated['location'],
            ]);

            $token = $jobSeeker->createToken('auth_token')->plainTextToken;

            return response()->json([
                'job_seeker' => $jobSeeker,
                'token' => $token,
                'token_type' => 'Bearer',
            ], 201);
        } catch (\Exception $e) {
            Log::error('JobSeeker Registration Error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function jobSeekerLogin(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            // Find the job seeker
            $jobSeeker = JobSeeker::where('email', $validated['email'])->first();
            
            // Check if user exists and password is correct
            if (!$jobSeeker || !Hash::check($validated['password'], $jobSeeker->password)) {
                return response()->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Delete existing tokens and create a new one
            $jobSeeker->tokens()->delete();
            $token = $jobSeeker->createToken('auth_token')->plainTextToken;

            return response()->json([
                'job_seeker' => $jobSeeker,
                'token' => $token,
                'token_type' => 'Bearer',
            ]);
        } catch (\Exception $e) {
            Log::error('JobSeeker Login Error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
