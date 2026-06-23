<?php

namespace App\Http\Controllers;

use App\Models\StudentScore;
use Illuminate\Http\Request;

class StudentScoreController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentScore::with('subject')->latest();
        
        if ($request->has('subject_id') && $request->subject_id !== '') {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('student_class') && $request->student_class !== '') {
            $query->where('student_class', $request->student_class);
        }

        return response()->json($query->get());
    }
}
