<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GoalResource;
use App\Models\Goal;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GoalController extends Controller
{
    public function index(Request $request)
    {
        return GoalResource::collection($request->user()->goals()->with('habit')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules($request));
        $goal = $request->user()->goals()->create($this->attributes($validated));

        return GoalResource::make($goal->load('habit'))->response()->setStatusCode(201);
    }

    public function show(Request $request, string $goal)
    {
        return GoalResource::make($this->ownedGoal($request, $goal)->load('habit'));
    }

    public function update(Request $request, string $goal)
    {
        $validated = $request->validate($this->rules($request, true));
        $ownedGoal = $this->ownedGoal($request, $goal);
        $ownedGoal->update($this->attributes($validated));

        return GoalResource::make($ownedGoal->refresh()->load('habit'));
    }

    public function destroy(Request $request, string $goal)
    {
        $this->ownedGoal($request, $goal)->delete();

        return response()->noContent();
    }

    private function rules(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';
        $ownedHabit = Rule::exists('habits', 'id')
            ->where(fn ($query) => $query->where('user_id', $request->user()->id));

        return [
            'habitId' => ['sometimes', 'nullable', 'uuid', $ownedHabit],
            'title' => [$required, 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'targetDays' => [$required, 'integer', 'min:1', 'max:100000'],
            'type' => [$required, Rule::in(['streak', 'total', 'weekly'])],
        ];
    }

    private function attributes(array $validated): array
    {
        $attributes = [];
        foreach (['title' => 'title', 'description' => 'description', 'targetDays' => 'target_days', 'type' => 'type', 'habitId' => 'habit_id'] as $key => $column) {
            if (array_key_exists($key, $validated)) {
                $attributes[$column] = $key === 'description' && $validated[$key] === '' ? null : $validated[$key];
            }
        }

        return $attributes;
    }

    private function ownedGoal(Request $request, string $id): Goal
    {
        return $request->user()->goals()->findOrFail($id);
    }
}
