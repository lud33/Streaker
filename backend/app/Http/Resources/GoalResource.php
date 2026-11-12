<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GoalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'habitId' => $this->habit_id,
            'title' => $this->title,
            'description' => $this->description ?? '',
            'targetDays' => $this->target_days,
            'currentDays' => $this->computeCurrentDays(),
            'type' => $this->type,
            'createdAt' => $this->created_at->toISOString(),
            'completedAt' => $this->completed_at?->toISOString(),
        ];
    }

    private function computeCurrentDays(): int
    {
        // No linked habit — return the manually stored value
        if (! $this->habit_id || ! $this->relationLoaded('habit') || ! $this->habit) {
            return (int) ($this->current_days ?? 0);
        }

        $dates = $this->habit->completed_dates ?? [];

        return match ($this->type) {
            'streak' => $this->computeStreak($dates),
            'total'  => count($dates),
            'weekly' => $this->computeWeeklyCount($dates),
            default  => (int) ($this->current_days ?? 0),
        };
    }

    /**
     * Current streak: consecutive days ending on today or yesterday.
     */
    private function computeStreak(array $dates): int
    {
        if (empty($dates)) {
            return 0;
        }

        // Sort descending so we walk backwards from the most recent date
        $sorted = $dates;
        rsort($sorted);

        $today     = Carbon::today()->toDateString();
        $yesterday = Carbon::yesterday()->toDateString();

        // Streak is only active if the habit was completed today or yesterday
        if ($sorted[0] !== $today && $sorted[0] !== $yesterday) {
            return 0;
        }

        $streak   = 1;
        $previous = Carbon::parse($sorted[0]);

        for ($i = 1; $i < count($sorted); $i++) {
            $current = Carbon::parse($sorted[$i]);
            if ($previous->diffInDays($current) === 1) {
                $streak++;
                $previous = $current;
            } else {
                break;
            }
        }

        return $streak;
    }

    /**
     * Weekly count: completions that fall within the current ISO week (Mon–Sun).
     */
    private function computeWeeklyCount(array $dates): int
    {
        $weekStart = Carbon::now()->startOfWeek()->toDateString(); // Monday
        $weekEnd   = Carbon::now()->endOfWeek()->toDateString();   // Sunday

        return count(array_filter($dates, fn (string $d) => $d >= $weekStart && $d <= $weekEnd));
    }
}
