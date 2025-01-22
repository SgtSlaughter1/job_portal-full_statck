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
     * Display a listing of the applications 
     */
    public function index(Request $request)
    {
        try {
            // Ensure user is authenticated
            if (!Auth::check()) {
                Log::warning('Unauthenticated access attempt to applications');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Authentication required'
                ], 401);
            }

            // Validate and sanitize input parameters
            $validated = $request->validate([
                'page' => 'sometimes|integer|min:1',
                'sort' => 'sometimes|string',
                'order' => 'sometimes|in:asc,desc',
                'status' => 'sometimes|string',
                'search' => 'sometimes|string'
            ]);

            // Get the authenticated user
            $user = $request->user();

            // Determine query based on user type
            if ($user instanceof \App\Models\JobSeeker) {
                // Job Seeker: fetch their own applications
                $query = $user->applications()
                    ->with([
                        'job:id,title,employer_id', 
                        'job.employer:id,company_name'
                    ])
                    ->select([
                        'id', 
                        'job_id', 
                        'status', 
                        'cover_letter', 
                        'created_at'
                    ]);
            } elseif ($user instanceof \App\Models\Employer) {
                // Employer: fetch applications for their jobs
                $query = Application::whereHas('job', function($q) use ($user) {
                    $q->where('employer_id', $user->id);
                })
                ->with([
                    'job:id,title,employer_id', 
                    'jobSeeker:id,name,email'
                ])
                ->select([
                    'id', 
                    'job_id', 
                    'job_seeker_id',
                    'status', 
                    'cover_letter', 
                    'created_at'
                ]);
            } else {
                // Unsupported user type
                Log::warning('Unsupported user type accessing applications', [
                    'user_type' => get_class($user)
                ]);
                
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized access'
                ], 403);
            }

            // Apply status filter if provided
            if (!empty($validated['status'] ?? null)) {
                $query->where('status', $validated['status']);
            }

            // Apply search filter if provided
            if (!empty($validated['search'] ?? null)) {
                $searchTerm = $validated['search'];
                $query->whereHas('job', function ($q) use ($searchTerm) {
                    $q->where('title', 'LIKE', "%{$searchTerm}%");
                });
            }

            // Apply sorting if provided
            $sort = $validated['sort'] ?? 'created_at';
            $order = $validated['order'] ?? 'desc';
            
            // Validate sort column to prevent SQL injection
            $allowedSortColumns = ['id', 'job_id', 'status', 'created_at'];
            $sort = in_array($sort, $allowedSortColumns) ? $sort : 'created_at';
            
            $query->orderBy($sort, $order);

            // Paginate with custom per page setting
            $applications = $query->paginate(
                perPage: $request->input('per_page', 10),
                page: $request->input('page', 1)
            );

            // Transform the paginated results
            return response()->json([
                'status' => 'success',
                'data' => $applications->items(),
                'meta' => [
                    'current_page' => $applications->currentPage(),
                    'last_page' => $applications->lastPage(),
                    'per_page' => $applications->perPage(),
                    'total' => $applications->total()
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors
            Log::error('Validation error in applications fetch', [
                'errors' => $e->errors()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Log the error for server-side tracking
            Log::error('Failed to fetch applications: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Unable to retrieve applications. Please try again later.',
                'error_details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Store a new job application
     */
    public function store(Request $request)
    {
        try {
            Log::info('Application submission started', [
                'request' => $request->all(),
                'user' => $request->user(),
                'files' => $request->files->all(),
                'headers' => $request->headers->all()
            ]);
            
            $validator = Validator::make($request->all(), [
                'job_id' => 'required|exists:jobs,id',
                'cover_letter' => 'nullable|string|max:5000',
                'resume' => 'required|file|mimes:pdf,doc,docx|max:2048'
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed', [
                    'errors' => $validator->errors()->toArray(),
                    'request_data' => $request->all()
                ]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Ensure user is a job seeker
            $user = $request->user();
            if (!$user instanceof \App\Models\JobSeeker) {
                Log::error('Non-job seeker attempted to apply', [
                    'user_type' => get_class($user),
                    'user_id' => $user->id
                ]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Only job seekers can apply for jobs'
                ], 403);
            }

            // Check if user has already applied
            $existingApplication = Application::where('job_id', $request->job_id)
                ->where('job_seeker_id', $user->id)
                ->first();

            if ($existingApplication) {
                Log::warning('Duplicate application attempt', [
                    'job_id' => $request->job_id,
                    'user_id' => $user->id,
                    'existing_application' => $existingApplication->toArray()
                ]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'You have already applied for this job'
                ], 422);
            }

            // Store resume file
            try {
                Log::info('Attempting to store resume file');
                $resumePath = $request->file('resume')->store('public/resumes');
                if (!$resumePath) {
                    throw new \Exception('Failed to store resume file');
                }
                $resumeUrl = Storage::url($resumePath);
                Log::info('Resume stored successfully', [
                    'path' => $resumePath,
                    'url' => $resumeUrl
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to store resume file', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to upload resume file'
                ], 500);
            }

            // Create application
            try {
                $application = Application::create([
                    'job_id' => $request->job_id,
                    'job_seeker_id' => $user->id,
                    'cover_letter' => $request->cover_letter,
                    'resume_url' => $resumeUrl,
                    'status' => 'pending'
                ]);

                Log::info('Application created successfully', [
                    'application_id' => $application->id,
                    'job_id' => $request->job_id,
                    'user_id' => $user->id
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Application submitted successfully',
                    'data' => $application->load('job.employer')
                ], 201);
            } catch (\Exception $e) {
                Log::error('Failed to create application record', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                
                // Clean up the uploaded file if application creation fails
                if (isset($resumePath)) {
                    Storage::delete($resumePath);
                }
                
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Application submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
                'user' => $request->user()
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
     * Update the status of an application
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            // Ensure user is authenticated
            $user = $request->user();
            if (!$user instanceof \App\Models\Employer) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized. Only employers can update application status.'
                ], 403);
            }

            // Validate input
            $validated = $request->validate([
                'status' => [
                    'required', 
                    'in:accepted,rejected,pending'
                ],
                'notes' => 'nullable|string|max:1000'
            ]);

            // Find the application
            $application = Application::whereHas('job', function($query) use ($user) {
                $query->where('employer_id', $user->id);
            })->findOrFail($id);

            // Update application status
            $application->status = $validated['status'];
            $application->employer_notes = $validated['notes'] ?? null;
            $application->save();

            // Log the status change
            Log::info('Application status updated', [
                'application_id' => $application->id,
                'new_status' => $application->status,
                'employer_id' => $user->id
            ]);

            // Return updated application
            return response()->json([
                'status' => 'success',
                'data' => $application->load(['job', 'jobSeeker'])
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Application not found or you do not have permission to update it.'
            ], 404);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Failed to update application status: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Unable to update application status. Please try again later.',
                'error_details' => config('app.debug') ? $e->getMessage() : null
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
