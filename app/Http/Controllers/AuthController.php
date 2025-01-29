<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('login');
    }

    public function login(LoginRequest $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        // تلاش برای ورود
        $credentials = $request->only('username', 'password');

        if (Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Login successful.',
                'user' => Auth::user(),
            ], 200);
        }

        return response()->json([
            'status' => '2',
            'message' => 'The provided credentials do not match our records.',
        ], 401);
    }

    public function logout()
    {
        Auth::logout();
        return redirect('/login');
    }

    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    public function register(LoginRequest $request)
    {
        // اعتبارسنجی ورودی‌ها
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        // ایجاد کاربر جدید
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'hash' => substr(md5($request->username), 10, 20),
            'password' => Hash::make($request->password),
        ]);

        Auth::login($user);

        return response()->json([
            'message' => 'Registration successful. You are now logged in.',
            'user' => $user
        ], 201);
    }

    public function check()
    {
        if (Auth::check()) {
            return response()->json(Auth::user());
        }

        return response()->json(['message' => 'کاربر لاگین نکرده است.'], 401);
    }
}