<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        return Subject::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $subject = Subject::create($validated);
        return response()->json(['message' => 'Mata pelajaran berhasil ditambahkan', 'subject' => $subject], 201);
    }

    public function show(Subject $subject)
    {
        return $subject;
    }

    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $subject->update($validated);
        return response()->json(['message' => 'Mata pelajaran berhasil diupdate', 'subject' => $subject]);
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return response()->json(['message' => 'Mata pelajaran berhasil dihapus']);
    }
}
