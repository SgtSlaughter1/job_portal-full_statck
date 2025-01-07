<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;

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
     * Display the employer's profile.
     */
    public function profile(Request $request)
    {
        return response()->json($request->user()->load('jobs'));
    }

    /**
     * Update the employer's profile.
     */
    public function updateProfile(Request $request)
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
