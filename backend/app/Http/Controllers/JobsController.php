<?php

namespace App\Http\Controllers;

use App\Models\Jobs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Class JobsController
 *
 * This controller handles CRUD operations for job listings.
 * It provides methods to list, create, update, and delete jobs.
 */
class JobsController extends Controller
{

    /**
     * Display a listing of the jobs.
     */
    public function index()
    {
        return response()->json(Jobs::latest('postedDate')->get());
    }

    /**
     * Display the specified job.
     */
    public function show($id)
    {
        $job = Jobs::findOrFail($id);
        return response()->json($job);
    }


    /**
     * Store a newly created job in storage.
     */

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'jobTitle' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'pay' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|array',
            'responsibilities' => 'required|array',
            'employmentType' => 'required|string|max:255',
            'experienceLevel' => 'required|string|max:255',
            'postedDate' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job = Jobs::create($request->all());
        return response()->json($job, 201);
    }

    /**
     * Update the specified job in storage.
     */
    public function update(Request $request, $id)
    {
        $job = Jobs::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'jobTitle' => 'string|max:255',
            'company' => 'string|max:255',
            'location' => 'string|max:255',
            'pay' => 'string|max:255',
            'description' => 'string',
            'requirements' => 'array',
            'responsibilities' => 'array',
            'employmentType' => 'string|max:255',
            'experienceLevel' => 'string|max:255',
            'postedDate' => 'date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job->update($request->all());
        return response()->json($job);
    }

    /**
     * Delete the specified job from storage.
     */
    public function destroy($id)
    {
        $job = Jobs::findOrFail($id);
        $job->delete();
        return response()->json(null, 204);
    }
}
