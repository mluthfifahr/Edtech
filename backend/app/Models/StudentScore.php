<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_name',
        'student_class',
        'subject_id',
        'type',
        'score',
        'correct_answers',
        'wrong_answers'
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
