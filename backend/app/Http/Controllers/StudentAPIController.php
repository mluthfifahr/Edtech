<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class StudentAPIController extends Controller
{
    public function getSubjects()
    {
        return response()->json(Subject::latest()->get());
    }

    public function getSubject($id)
    {
        $subject = Subject::findOrFail($id);
        return response()->json($subject);
    }

    public function getQuestions(Request $request, $subjectId)
    {
        $type = $request->query('type', 'quiz');
        
        $questions = \App\Models\Question::with(['choices' => function($query) {
            $query->inRandomOrder();
        }])
        ->where('subject_id', $subjectId)
        ->where('type', $type)
        ->inRandomOrder()
        ->get();

        return response()->json($questions);
    }

    public function submitScore(Request $request)
    {
        $request->validate([
            'student_name' => 'required|string',
            'student_class' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
            'type' => 'required|in:quiz,tebak_gambar',
            'score' => 'required|integer',
            'correct_answers' => 'required|integer',
            'wrong_answers' => 'required|integer',
        ]);

        $score = \App\Models\StudentScore::create($request->all());

        return response()->json(['message' => 'Score submitted successfully', 'data' => $score], 201);
    }
}
