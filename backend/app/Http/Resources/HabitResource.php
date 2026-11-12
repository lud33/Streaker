<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HabitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'color' => $this->color,
            'category' => $this->category,
            'createdAt' => $this->created_at->toISOString(),
            'completedDates' => $this->completed_dates ?? [],
            'completionCounts' => $this->completion_counts ?? [],
            'completionTimes' => $this->completion_times ?? [],
        ];
    }
}
