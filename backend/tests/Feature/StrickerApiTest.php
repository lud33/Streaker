<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StrickerApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_and_revoke_the_current_token(): void
    {
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => 'strong-password',
        ]);

        $token = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'strong-password',
        ])->assertOk()->json('token');

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('user.email', $user->email);

        $this->withToken($token)->postJson('/api/logout')->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => explode('|', $token, 2)[0],
        ]);
        $this->app['auth']->forgetGuards();

        $this->withToken($token)->getJson('/api/user')->assertUnauthorized();
    }

    public function test_registered_user_can_create_and_complete_a_habit(): void
    {
        $response = $this->postJson('/api/register', [
            'username' => 'Taylor',
            'email' => 'taylor@example.com',
            'password' => 'strong-password',
        ]);

        $response->assertCreated()
            ->assertJsonPath('user.username', 'Taylor')
            ->assertJsonStructure(['user' => ['id', 'username', 'email'], 'token']);

        $this->withToken($response->json('token'))
            ->postJson('/api/habits', [
                'name' => 'Read',
                'color' => '#10b981',
                'category' => 'learning',
            ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Read')
            ->assertJsonPath('data.completedDates', []);

        $habitId = $this->withToken($response->json('token'))
            ->getJson('/api/habits')
            ->assertOk()
            ->json('data.0.id');

        $this->withToken($response->json('token'))
            ->postJson("/api/habits/{$habitId}/completions", [
                'date' => '2026-09-30',
                'hour' => 9,
            ])
            ->assertOk()
            ->assertJsonPath('data.completionCounts.2026-09-30', 1)
            ->assertJsonPath('data.completionTimes.2026-09-30.0', 9);
    }

    public function test_habits_are_private_and_goals_can_be_linked(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();

        $habitResponse = $this->actingAs($owner)->postJson('/api/habits', [
            'name' => 'Exercise',
            'color' => '#ff6b35',
            'category' => 'fitness',
        ])->assertCreated();

        $habitId = $habitResponse->json('data.id');

        $this->actingAs($otherUser)
            ->getJson("/api/habits/{$habitId}")
            ->assertNotFound();

        $this->actingAs($owner)
            ->postJson('/api/goals', [
                'habitId' => $habitId,
                'title' => '30 day streak',
                'description' => 'Keep moving',
                'targetDays' => 30,
                'type' => 'streak',
            ])
            ->assertCreated()
            ->assertJsonPath('data.habitId', $habitId)
            ->assertJsonPath('data.targetDays', 30);

        $this->actingAs($otherUser)
            ->postJson('/api/goals', [
                'habitId' => $habitId,
                'title' => 'Invalid link',
                'targetDays' => 1,
                'type' => 'total',
            ])
            ->assertUnprocessable();
    }
}
