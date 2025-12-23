<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Mission;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request,$missionId)
    {
        $data = $request->validate([
            'content' => 'required|string'
        ]);

        $data['user_id'] = auth()->id();
        $data['mission_id'] = $missionId;

        $message = Message::create($data);
        event(new \App\Events\NewMessageEvent($message));
        return response()->json([
            'content' => $message->content,
            'user' => $message->user()->first(['id', 'name']),
        ], 201);
    }

    public function show($missionId)
    {
        $messages = Message::where('mission_id', $missionId)
        ->join("users","messages.user_id","=","users.id")
        ->select('content','users.id','users.name')->get();
        return response()->json($messages);
    }
}
