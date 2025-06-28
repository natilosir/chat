<?php

namespace App\Http\Controllers;

use App\Http\Requests\EditRequest;
use App\Http\Requests\MessageRequest;
use App\Http\Requests\SendRequest;
use App\Http\Requests\ShowRequest;
use App\Message;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function show(ShowRequest $request)
    {
        $hash = Auth::user()->hash;
        $id   = Auth::id();

        $messages = Message::where(function ($query) use ($hash) {
            $query
                ->where('sender', $hash)
                ->orwhere('receiver', $hash);
        })
            ->Where(function ($query) use ($request) {
                $query
                    ->where('receiver', $request->receiver)
                    ->orwhere('sender', $request->receiver);
            })
            ->get()
            ->map(function ($message) use ($hash) {
                if ($message->receiver == $hash) {
                    $message->status = 1;
                    $message->save();
                }

                $formattedDate = time::format(strtotime($message->created_at), 'W D M H:i:s');

                return [
                    'id'         => $message->id,
                    'sender'     => $message->sender,
                    'text'       => $message->text,
                    'status'     => (int) $message->status,
                    'created_at' => $formattedDate,
                ];
            });

        DB::table('chats')
            ->join('users', 'chats.username', '=', 'users.username')
            ->where('chats.user_id', $id)
            ->where('users.hash', $request->receiver)
            ->update(['chats.updated_at' => Carbon::now()]);

        return response()->json($messages);
    }

    public function send(SendRequest $request)
    {
        $hash = Auth::user()->hash;

        $message = Message::create([
            'sender'   => $hash,
            'receiver' => $request['receiver'],
            'text'     => $request['text'],
        ]);

        return response()->json([
            'success' => true,
            'id'      => $message->id,
            'message' => 'Message sent successfully!',
        ]);
    }

    public function edit(EditRequest $request)
    {
        $hash = Auth::user()->hash;

        $message = Message::where('id', $request->id)
            ->where('sender', $hash)
            ->first();

        if (! $message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found or you do not have permission to edit it.',
            ], 404);
        }

        $message->text   = $request->text;
        $message->status = 2;
        $message->save();

        return response()->json([
            'success' => true,
            'message' => 'Message updated successfully!',
        ]);
    }

    public function load(MessageRequest $request)
    {
        $hash = Auth::user()->hash;

        $messages = Message::where('receiver', $hash)
            ->where('sender', $request->receiver)
            ->whereIn('status', [0, 2])
            ->get();

        if ($messages->isNotEmpty()) {
            Message::where('receiver', $hash)
                ->where('sender', $request->receiver)
                ->whereIn('status', [0, 2])
                ->update(['status' => 1]);
        }

        $formattedMessages = $messages->map(function ($message) {
            $formattedDate = date('H:i:s', strtotime($message->created_at));

            return [
                'id'     => $message->id,
                'sender' => $message->sender,
                'text'   => $message->text,
                'date'   => $formattedDate,
                'status' => (int) $message->status == 2 ? 2 : 5,
            ];
        });

        if ($formattedMessages->isEmpty()) {
            $hasSenderMessages = Message::where('sender', $hash)
                ->where('receiver', $request->receiver)
                ->whereIn('status', [0, 2])
                ->exists();

            if ($hasSenderMessages) {
                $formattedMessages = ['X'];
            }
        }

        return response()->json($formattedMessages);
    }
}
