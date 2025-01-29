<?php

namespace App\Http\Controllers;

use App\Http\Requests\MessageRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\User;
use App\Chat;


class IndexController extends Controller
{
    public function index()
    {
        $user = Auth::user(); 
        $chats = Chat::where('user_id', $user->id)->orderBy('updated_at', 'desc')->get(); 

        if ($chats->isEmpty()) {
            $lastChat = null; 
        } else {
            $lastChat = User::where('username', $chats->first()->username)->first()->hash; 
        }

        $chats = $chats->map(function ($message) {
            $hash = User::where('username', $message->username)->first()->hash; 

            return [
                'username' => $message->username,
                'hash' => $hash,
            ];
        });

        return view('index', compact('user', 'chats', 'lastChat'));
    }
    public function CreateNewChat(MessageRequest $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'کاربر وارد نشده است.'], 401);
        }

        $username = strtolower($request->username);

        if ($user->username === $username) {
            return response()->json(['error' => 'میخوای با خودت حرف بزنی؟ کثخلی چیزی هستی؟'], 401);
        }

        $UserExists = User::where('username', $username);
        if (!$UserExists->exists()) {
            return response()->json(['error' => 'این نام کاربری در سیستم وجود ندارد.'], 404);
        }

        if (Chat::where('username', $username)
            ->where('user_id', $user->id)
            ->exists()) {
            return response()->json(['error' => 'این مکالمه باز هست.'], 409);
        }

        Chat::create([
            'user_id' => $user->id,
            'username' => $username,
        ]);

        $hash = $UserExists->first()->hash;
        return response()->json(
            [
                'success' => 'کاربر با موفقیت ایجاد شد',
                'hash' => $hash
            ], 200);
    }
}
