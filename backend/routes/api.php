<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\StudentAPIController;
use App\Http\Controllers\StudentScoreController;
use App\Http\Controllers\DashboardController;

// Authentication Route
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user', function (Illuminate\Http\Request $request) {
    return $request->user();
});

// Admin CRUD Routes (Protected)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/dashboard-stats', [DashboardController::class, 'getStats']);
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('modules', ModuleController::class);
    Route::apiResource('questions', QuestionController::class);
    Route::get('/scores', [StudentScoreController::class, 'index']);
});

// Student API Routes (Public)
Route::prefix('student')->group(function () {
    Route::get('/subjects', [StudentAPIController::class, 'getSubjects']);
    Route::get('/subjects/{id}', [StudentAPIController::class, 'getSubject']);
    Route::get('/questions/{subjectId}', [StudentAPIController::class, 'getQuestions']);
    Route::post('/submit-score', [StudentAPIController::class, 'submitScore']);
});
