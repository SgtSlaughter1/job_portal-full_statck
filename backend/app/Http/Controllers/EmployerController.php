<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Application;
use App\Models\Employer;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class EmployerController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Get the authenticated employer's profile
     */
    public function getProfile(Request $request)
    {
        try {
            $employer = $request->user();
            if (!$employer || !($employer instanceof Employer)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized or invalid user type'
                ], 401);
            }

            return response()->json([
                'status' => 'success',
                'data' => $employer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch employer profile'
            ], 500);
        }
    }

    /**
     * Update the employer's profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $employer = $request->user();
            if (!$employer || !($employer instanceof Employer)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized or invalid user type'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'company_name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:employers,email,' . $employer->id,
                'phone' => 'sometimes|string|max:20',
                'company_description' => 'sometimes|string',
                'website' => 'sometimes|url|nullable',
                'industry' => 'sometimes|string|max:100',
                'location' => 'sometimes|string|max:255',
                'logo_url' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['logo_url']);

            // Handle logo upload if present
            if ($request->hasFile('logo_url')) {
                // Delete old logo if exists
                if ($employer->logo_url) {
                    $oldPath = str_replace('/storage/', 'public/', $employer->logo_url);
                    Storage::delete($oldPath);
                }

                $path = $request->file('logo_url')->store('public/logos');
                $data['logo_url'] = Storage::url($path);
            }

            $employer->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'data' => $employer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get employer's job listings and applications
     */
    public function getDashboardData(Request $request)
    {
        try {
            $employer = $request->user();
            if (!$employer || !($employer instanceof Employer)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized or invalid user type'
                ], 401);
            }

            // Load relationships
            $employer->load(['jobs' => function ($query) {
                $query->with(['applications' => function ($query) {
                    $query->with('jobSeeker:id,name,email,phone,education_level,experience_years');
                }]);
            }]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'profile' => $employer,
                    'jobs' => $employer->jobs
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch dashboard data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the employer's profile.
     */
    public function profile(Request $request)
    {
        return response()->json($request->user()->load('jobs'));
    }

    /**
     * Update the employer's profile.
     */
    public function updateProfileOld(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string',
            'company_description' => 'sometimes|string',
            'website' => 'nullable|url',
            'industry' => 'sometimes|string',
            'location' => 'sometimes|string',
            'logo_url' => 'nullable|url',
        ]);

        $request->user()->update($validated);

        return response()->json($request->user());
    }

    /**
     * Display a listing of the employer's jobs.
     */
    public function jobs(Request $request)
    {
        $jobs = $request->user()->jobs()
            ->with('applications.jobSeeker')
            ->latest()
            ->paginate(10);

        return response()->json($jobs);
    }

    /**
     * Display a listing of the job's applications.
     */
    public function applications(Request $request, Job $job)
    {
        $this->authorize('viewApplications', $job);

        $applications = $job->applications()
            ->with('jobSeeker')
            ->latest()
            ->paginate(10);

        return response()->json($applications);
    }

    /**
     * Update the status of a job application.
     */
    public function updateApplicationStatus(Request $request, Application $application)
    {
        $this->authorize('updateStatus', $application);

        $validated = $request->validate([
            'status' => 'required|in:pending,reviewed,shortlisted,rejected,accepted',
            'employer_notes' => 'nullable|string',
        ]);

        $application->update($validated);

        return response()->json($application->load('jobSeeker'));
    }
}
