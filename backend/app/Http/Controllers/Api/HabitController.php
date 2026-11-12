<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HabitResource;
use App\Models\Habit;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class HabitController extends Controller
{
    public function index(Request $request)
    {
        return HabitResource::collection($request->user()->habits()->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $habit = $request->user()->habits()->create($this->attributes($validated));

        return HabitResource::make($habit)->response()->setStatusCode(201);
    }

    public function show(Request $request, string $habit)
    {
        return HabitResource::make($this->ownedHabit($request, $habit));
    }

    public function update(Request $request, string $habit)
    {
        $validated = $request->validate($this->rules(true));
        $ownedHabit = $this->ownedHabit($request, $habit);
        $ownedHabit->update($this->attributes($validated));

        return HabitResource::make($ownedHabit->refresh());
    }

    public function destroy(Request $request, string $habit)
    {
        $this->ownedHabit($request, $habit)->delete();

        return response()->noContent();
    }

    public function complete(Request $request, string $habit)
    {
        $validated = $request->validate([
            'date' => ['sometimes', 'date_format:Y-m-d'],
            'hour' => ['sometimes', 'integer', 'between:0,23'],
        ]);
        $date = $validated['date'] ?? now()->toDateString();
        $hour = $validated['hour'] ?? now()->hour;
        $ownedHabit = $this->ownedHabit($request, $habit);
        $counts = $ownedHabit->completion_counts ?? [];
        $times = $ownedHabit->completion_times ?? [];
        $dates = $ownedHabit->completed_dates ?? [];
        $counts[$date] = ($counts[$date] ?? 0) + 1;
        $times[$date] = [...($times[$date] ?? []), $hour];

        $ownedHabit->update([
            'completed_dates' => array_values(array_unique([...$dates, $date])),
            'completion_counts' => $counts,
            'completion_times' => $times,
        ]);

        return HabitResource::make($ownedHabit->refresh());
    }

    private function ownedHabit(Request $request, string $id): Habit
    {
        return $request->user()->habits()->findOrFail($id);
    }

    private function rules(bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return [
            'name' => [$required, 'string', 'max:100'],
            'color' => [$required, 'string', 'max:20'],
            'category' => [$required, 'string', 'max:50'],
            'completedDates' => ['sometimes', 'array'],
            'completedDates.*' => ['date_format:Y-m-d'],
            'completionCounts' => ['sometimes', 'array'],
            'completionCounts.*' => ['integer', 'min:0'],
            'completionTimes' => ['sometimes', 'array'],
            'completionTimes.*' => ['array'],
            'completionTimes.*.*' => ['integer', 'between:0,23'],
        ];
    }

    private function attributes(array $validated): array
    {
        $attributes = Arr::only($validated, ['name', 'color', 'category']);

        foreach (['completedDates', 'completionCounts', 'completionTimes'] as $key) {
            if (array_key_exists($key, $validated)) {
                $attributes[Str::snake($key)] = $validated[$key];
            }
        }

        return $attributes;
    }
}
