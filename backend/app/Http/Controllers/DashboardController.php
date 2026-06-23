<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentScore;
use App\Models\Subject;
use App\Models\Question;

class DashboardController extends Controller
{
    public function getStats()
    {
        // Total murid unik yang pernah main
        $totalStudents = StudentScore::distinct('student_name')->count('student_name');
        
        // Total mata pelajaran
        $totalSubjects = Subject::count();
        
        // Total bank soal
        $totalQuestions = Question::count();
        
        // 10 Riwayat skor terbaru untuk grafik/tabel
        $recentScores = StudentScore::with('subject')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($score) {
                return [
                    'id' => $score->id,
                    'student_name' => $score->student_name,
                    'subject_name' => $score->subject ? $score->subject->name : '-',
                    'score' => $score->score,
                    'created_at' => $score->created_at->toISOString(),
                ];
            });

        return response()->json([
            'total_students' => $totalStudents,
            'total_subjects' => $totalSubjects,
            'total_questions' => $totalQuestions,
            'recent_scores' => $recentScores
        ]);
    }
}
