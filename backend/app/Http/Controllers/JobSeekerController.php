<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Models\JobSeeker;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class JobSeekerController extends Controller
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
     * Get the authenticated job seeker's profile
     */
    public function getProfile(Request $request)
    {
        try {
            $jobSeeker = $request->user();
            if (!$jobSeeker || !($jobSeeker instanceof JobSeeker)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized or invalid user type'
                ], 401);
            }

            return response()->json([
                'status' => 'success',
                'data' => $jobSeeker
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch job seeker profile'
            ], 500);
        }
    }

    /**
     * Update the job seeker's profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $jobSeeker = $request->user();
            if (!$jobSeeker || !($jobSeeker instanceof JobSeeker)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized or invalid user type'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:job_seekers,email,' . $jobSeeker->id,
                'phone' => 'sometimes|string|max:20',
                'bio' => 'sometimes|string|nullable',
                'skills' => 'sometimes|array',
                'education_level' => 'sometimes|string|max:100',
                'experience_years' => 'sometimes|integer|min:0',
                'current_position' => 'sometimes|string|max:100',
                'expected_salary' => 'sometimes|integer|min:0',
                'is_available' => 'sometimes|boolean',
                'resume_url' => 'sometimes|file|mimes:pdf,doc,docx|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['resume_url']);

            // Handle resume upload if present
            if ($request->hasFile('resume_url')) {
                // Delete old resume if exists
                if ($jobSeeker->resume_url) {
                    $oldPath = str_replace('/storage/', 'public/', $jobSeeker->resume_url);
                    Storage::delete($oldPath);
                }

                $path = $request->file('resume_url')->store('public/resumes');
                $data['resume_url'] = Storage::url($path);
            }

            // Handle skills array
            if ($request->has('skills')) {
                $data['skills'] = array_map('trim', $request->skills);
            }

            $jobSeeker->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'data' => $jobSeeker
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get job seeker's applications and related data
     */
    public function getDashboardData(Request $request)
    {
        try {
            $jobSeeker = $request->user();
            if (!$jobSeeker || !($jobSeeker instanceof JobSeeker)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized or invalid user type'
                ], 401);
            }

            // Load relationships
            $jobSeeker->load(['applications' => function ($query) {
                $query->with(['job' => function ($query) {
                    $query->with('employer:id,company_name,industry,location');
                }]);
            }]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'profile' => $jobSeeker,
                    'applications' => $jobSeeker->applications
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
     * Get the authenticated user's job applications.
     */
    public function applications(Request $request)
    {
        $applications = $request->user()
            ->applications()
            ->with(['job.employer'])
            ->latest()
            ->paginate(10);

        return response()->json($applications);
    }

    /**
     * Apply for a job.
     */
    public function apply(Request $request, Job $job)
    {
        $validated = $request->validate([
            'cover_letter' => 'nullable|string',
            'resume_url' => 'required|url',
        ]);

        // Check if already applied
        $existingApplication = $request->user()
            ->applications()
            ->where('job_id', $job->id)
            ->first();

        if ($existingApplication) {
            return response()->json([
                'message' => 'You have already applied for this job'
            ], 422);
        }

        $application = $request->user()->applications()->create([
            'job_id' => $job->id,
            'cover_letter' => $validated['cover_letter'],
            'resume_url' => $validated['resume_url'],
        ]);

        return response()->json($application->load('job.employer'), 201);
    }

    /**
     * Withdraw a job application.
     */
    public function withdrawApplication(Application $application)
    {
        $this->authorize('delete', $application);

        $application->delete();

        return response()->json(null, 204);
    }

    /**
     * Get the authenticated user's saved jobs.
     */
    public function savedJobs(Request $request)
    {
        $savedJobs = $request->user()
            ->savedJobs()
            ->with('employer')
            ->latest()
            ->paginate(10);

        return response()->json($savedJobs);
    }

    /**
     * Save a job.
     */
    public function saveJob(Request $request, Job $job)
    {
        $request->user()->savedJobs()->attach($job->id);

        return response()->json([
            'message' => 'Job saved successfully'
        ]);
    }

    /**
     * Unsave a job.
     */
    public function unsaveJob(Request $request, Job $job)
    {
        $request->user()->savedJobs()->detach($job->id);

        return response()->json([
            'message' => 'Job removed from saved jobs'
        ]);
    }
}
