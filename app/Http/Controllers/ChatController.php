<?php

namespace App\Http\Controllers;
use App\Message;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\time;
use App\Http\Requests\ShowRequest;
use App\Http\Requests\SendRequest;
use App\Http\Requests\MessageRequest;

class ChatController extends Controller
{
    public function show(ShowRequest $request)
    {
        $hash=Auth::user()->hash;

        $messages = Message::where(function ($query) use ($hash) {
            $query
            ->where('sender', $hash)
            ->orwhere('receiver', $hash)
            ;
        })
        ->Where(function ($query) use ($request) {
            $query
            ->where('receiver', $request->receiver)
            ->orwhere('sender', $request->receiver)
            ;
        })
        ->get()
        ->map(function ($message) use ($hash) {

            if ($message->receiver == $hash) {
                $message->status = 1;
                $message->save();
            }

            $formattedDate = time::format(strtotime($message->created_at), 'W D M H:i:s');
            return [
                'sender' => $message->sender,
                'text' => $message->text,
                'created_at' => $formattedDate,
                'status' => (int) $message->status,
            ];
        });
        return response()->json($messages);
    }

    public function send(SendRequest $request){

        $hash=Auth::user()->hash;

        Message::create([
            'sender' => $hash,
            'receiver' => $request['receiver'],
            'text' => $request['text'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully!',
        ]);
    }

    public function load(MessageRequest $request)
    {
        $hash = Auth::user()->hash;

        $messages = Message::where('receiver', $hash)
            ->where('sender', $request->receiver)
            ->where('status', 0)
            ->get()
            ->map(function ($message) {
                $message->status = 1;
                $message->save();

                $formattedDate = date('H:i:s', strtotime($message->created_at));
                return [
                    'sender' => $message->sender,
                    'text' => $message->text,
                    'date' => $formattedDate,
                    'status' => (int) 5,
                ];
            });

        if ($messages->isEmpty()) {
            $messages = Message::where('receiver', $hash)
                ->where('sender', $request->receiver)
                ->where('status', '!=', 1)
                ->get()
                ->map(function () {
                    return [
                        'status' => 4,
                    ];
                });
        }

        return response()->json($messages);
    }
}
