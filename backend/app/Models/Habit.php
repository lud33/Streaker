<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Habit extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'color',
        'category',
        'completed_dates',
        'completion_counts',
        'completion_times',
    ];

    protected function casts(): array
    {
        return [
            'completed_dates' => 'array',
            'completion_counts' => 'array',
            'completion_times' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
