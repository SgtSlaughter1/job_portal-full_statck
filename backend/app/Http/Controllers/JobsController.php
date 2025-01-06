<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Job;
use Illuminate\Http\Request;

class JobsController extends Controller{
    use AuthorizesRequests;

    /**
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jobs = Job::with('employer')
            ->where('is_active', true)
            ->where('deadline', '>=', now())
            ->latest()
            ->paginate(10);

        return response()->json([
            'data' => $jobs->items(),
            'total' => $jobs->total(),
            'per_page' => $jobs->perPage(),
            'current_page' => $jobs->currentPage(),
            'last_page' => $jobs->lastPage()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'type' => 'required|string|in:full-time,part-time,contract',
            'salary' => 'nullable|numeric',
            'experience_level' => 'required|string',
            'requirements' => 'required|array',
            'responsibilities' => 'required|array',
            'deadline' => 'required|date|after:today',
        ]);

        $job = $request->user()->jobs()->create($validated);

        return response()->json([
            'data' => $job
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Job $job)
    {
        return response()->json([
            'data' => $job->load('employer')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Job $job)
    {
        $this->authorize('update', $job);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string',
            'type' => 'sometimes|string|in:full-time,part-time,contract',
            'salary' => 'nullable|numeric',
            'experience_level' => 'sometimes|string',
            'requirements' => 'sometimes|array',
            'responsibilities' => 'sometimes|array',
            'deadline' => 'sometimes|date|after:today',
            'is_active' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ]);

        $job->update($validated);

        return response()->json([
            'data' => $job
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Job $job)
    {
        $this->authorize('delete', $job);

        $job->delete();

        return response()->json(null, 204);
    }

    /**
     * Search for jobs based on keyword, location, type, and experience level.
     */
    public function search(Request $request)
    {
        $query = Job::with('employer')->where('is_active', true);

        if ($request->has('keyword')) {
            $keyword = $request->keyword;
            $query->where(function($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if ($request->has('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        $jobs = $query->latest()->paginate(10);

        return response()->json([
            'data' => $jobs->items(),
            'total' => $jobs->total(),
            'per_page' => $jobs->perPage(),
            'current_page' => $jobs->currentPage(),
            'last_page' => $jobs->lastPage()
        ]);
    }
}
