<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Choice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class QuestionController extends Controller
{
    public function index(Request $request)
    {
        $query = Question::with(['choices', 'subject']);
        
        if ($request->has('subject_id') && $request->subject_id !== '') {
            $query->where('subject_id', $request->subject_id);
        }

        return $query->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'type' => 'required|in:quiz,tebak_gambar',
            'question_text' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'choices' => 'required|array|min:2',
        ]);

        $data = $request->only(['subject_id', 'type', 'question_text']);

        // Upload file gambar (Untuk tebak gambar / jika ada ilustrasi)
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('questions', 'public');
            $data['image_path'] = $path;
        }

        $question = Question::create($data);

        // Menyimpan Pilihan Ganda
        if (is_array($request->choices)) {
            foreach ($request->choices as $choiceData) {
                // Konversi string "true"/"false" yang biasanya dikirim via FormData ke boolean
                $isCorrect = filter_var($choiceData['is_correct'] ?? false, FILTER_VALIDATE_BOOLEAN);
                
                $question->choices()->create([
                    'choice_text' => $choiceData['choice_text'] ?? null,
                    'is_correct' => $isCorrect
                ]);
            }
        }

        return response()->json(['message' => 'Soal berhasil ditambahkan', 'question' => $question->load('choices')], 201);
    }

    public function update(Request $request, Question $question)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'type' => 'required|in:quiz,tebak_gambar',
            'question_text' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'choices' => 'required|array|min:2',
        ]);

        $data = $request->only(['subject_id', 'type', 'question_text']);

        // Upload file gambar baru jika ada
        if ($request->hasFile('image')) {
            // Hapus gambar lama
            if ($question->image_path) {
                Storage::disk('public')->delete($question->image_path);
            }
            $path = $request->file('image')->store('questions', 'public');
            $data['image_path'] = $path;
        }

        $question->update($data);

        // Update Pilihan Ganda (Hapus lama, buat baru agar simpel)
        if (is_array($request->choices)) {
            $question->choices()->delete();
            foreach ($request->choices as $choiceData) {
                $isCorrect = filter_var($choiceData['is_correct'] ?? false, FILTER_VALIDATE_BOOLEAN);
                
                $question->choices()->create([
                    'choice_text' => $choiceData['choice_text'] ?? null,
                    'is_correct' => $isCorrect
                ]);
            }
        }

        return response()->json(['message' => 'Soal berhasil diupdate', 'question' => $question->load('choices')], 200);
    }

    public function destroy(Question $question)
    {
        // Hapus file gambar jika ada
        if ($question->image_path) {
            Storage::disk('public')->delete($question->image_path);
        }
        $question->delete();
        return response()->json(['message' => 'Soal berhasil dihapus']);
    }
}
