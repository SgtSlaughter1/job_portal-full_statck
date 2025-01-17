<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ApplicationController extends Controller
{
    /**
     * Display a listing of the applications for the authenticated job seeker
     */
    public function index(Request $request)
    {
        try {
            $applications = $request->user()->applications()
                ->with(['job.employer'])
                ->latest()
                ->paginate(10);

            return response()->json([
                'status' => 'success',
                'data' => $applications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch applications'
            ], 500);
        }
    }

    /**
     * Store a new job application
     */
    public function store(Request $request)
    {
        try {
            Log::info('Application submission started', ['request' => $request->all()]);
            
            $validator = Validator::make($request->all(), [
                'job_id' => 'required|exists:jobs,id',
                'cover_letter' => 'nullable|string|max:5000',
                'resume' => 'required|file|mimes:pdf,doc,docx|max:2048'
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if user has already applied
            $existingApplication = Application::where('job_id', $request->job_id)
                ->where('job_seeker_id', $request->user()->id)
                ->first();

            if ($existingApplication) {
                Log::warning('Duplicate application attempt', ['job_id' => $request->job_id, 'user_id' => $request->user()->id]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'You have already applied for this job'
                ], 422);
            }

            // Store resume file
            Log::info('Storing resume file');
            $resumePath = $request->file('resume')->store('public/resumes');
            $resumeUrl = Storage::url($resumePath);
            Log::info('Resume stored', ['path' => $resumePath, 'url' => $resumeUrl]);

            // Create application
            $application = Application::create([
                'job_id' => $request->job_id,
                'job_seeker_id' => $request->user()->id,
                'cover_letter' => $request->cover_letter,
                'resume_url' => $resumeUrl,
                'status' => 'pending'
            ]);

            Log::info('Application created successfully', ['application_id' => $application->id]);

            return response()->json([
                'status' => 'success',
                'message' => 'Application submitted successfully',
                'data' => $application->load('job.employer')
            ], 201);
        } catch (\Exception $e) {
            Log::error('Application submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to submit application: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified application
     */
    public function show(string $id)
    {
        try {
            $application = Application::with(['job.employer', 'jobSeeker'])
                ->findOrFail($id);

            // Check if user is authorized to view this application
            if ($application->job_seeker_id !== Auth::id() && 
                $application->job->employer_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            return response()->json([
                'status' => 'success',
                'data' => $application
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch application details'
            ], 500);
        }
    }

    /**
     * Update application status (only for employers)
     */
    public function update(Request $request, string $id)
    {
        try {
            $application = Application::findOrFail($id);

            // Check if user is the employer of this job
            if ($application->job->employer_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'status' => 'required|in:pending,reviewed,shortlisted,rejected,accepted',
                'employer_notes' => 'nullable|string|max:1000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $application->update($request->only(['status', 'employer_notes']));

            return response()->json([
                'status' => 'success',
                'message' => 'Application status updated successfully',
                'data' => $application->load('job.employer')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update application status'
            ], 500);
        }
    }

    /**
     * Withdraw an application (only for job seekers)
     */
    public function destroy(string $id)
    {
        try {
            $application = Application::findOrFail($id);

            // Check if user is the owner of this application
            if ($application->job_seeker_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Delete resume file
            if ($application->resume_url) {
                $path = str_replace('/storage/', 'public/', $application->resume_url);
                Storage::delete($path);
            }

            $application->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Application withdrawn successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to withdraw application'
            ], 500);
        }
    }
}
