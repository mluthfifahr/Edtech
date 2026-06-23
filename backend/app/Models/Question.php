<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['subject_id', 'type', 'question_text', 'image_path', 'points'];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function choices()
    {
        return $this->hasMany(Choice::class);
    }
}
