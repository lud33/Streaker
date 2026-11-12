<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'max:40'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create([
            'name' => $validated['username'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        return response()->json([
            'user' => $this->userData($user),
            'token' => $user->createToken('stricker-web')->plainTextToken,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return response()->json([
            'user' => $this->userData($user),
            'token' => $user->createToken('stricker-web')->plainTextToken,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function user(Request $request)
    {
        return response()->json(['user' => $this->userData($request->user())]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'username' => ['sometimes', 'string', 'max:40'],
            'email'    => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['sometimes', 'string', 'min:8'],
            'currentPassword' => ['required_with:password', 'string'],
        ]);

        // Verify current password before allowing a password change
        if (isset($validated['password'])) {
            if (! Hash::check($validated['currentPassword'], $user->password)) {
                throw ValidationException::withMessages([
                    'currentPassword' => ['The current password is incorrect.'],
                ]);
            }
        }

        $updates = [];

        if (isset($validated['username'])) {
            $updates['name'] = $validated['username'];
        }

        if (isset($validated['email'])) {
            $updates['email'] = $validated['email'];
        }

        if (isset($validated['password'])) {
            $updates['password'] = $validated['password'];
        }

        if (! empty($updates)) {
            $user->update($updates);
        }

        return response()->json(['user' => $this->userData($user->refresh())]);
    }

    public function destroyAccount(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'password' => ['required', 'string'],
        ]);

        if (! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The password is incorrect.'],
            ]);
        }

        // Revoke all tokens before deleting so any in-flight requests 401 immediately
        $user->tokens()->delete();
        $user->delete();

        return response()->noContent();
    }

    private function userData(User $user): array
    {
        return [
            'id' => (string) $user->id,
            'username' => $user->name,
            'email' => $user->email,
        ];
    }
}
