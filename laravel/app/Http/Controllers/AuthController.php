<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);

            $token = JWTAuth::fromUser($user);

            return ResponseFormatter::success([
                'user' => $user,
                'token' => $token,
            ], 'User registered successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error($e->getMessage(), 500);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (! $token = JWTAuth::attempt($credentials)) {
            return ResponseFormatter::error('Invalid credentials', 401);
        }

        return ResponseFormatter::success(['token' => $token], 'Login successful');
    }

    public function me()
    {
        return ResponseFormatter::success(auth()->user(), 'Authenticated user data');
    }

    public function logout()
    {
        auth()->logout();
        return ResponseFormatter::success(null, 'Successfully logged out');
    }
}
