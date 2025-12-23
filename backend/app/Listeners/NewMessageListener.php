<?php

namespace App\Listeners;

use App\Events\NewMessageEvent;
use App\Notifications\NewMessageNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NewMessageListener implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NewMessageEvent $event): void
    {
        $mission = $event->message->mission;
        // fetch users that have message in this mission and the user that create the mission
        $users = $mission
            ->messages()
            ->with("user")
            ->get()
            ->pluck("user")
            ->unique("id")
            ->filter();
        $creator = $mission->createdBy;

        foreach (array_merge($users, [$creator]) as $user) {
            if ($user->id === $event->message->user_id) {
                continue;
            }
            $user->notify(new NewMessageNotification($mission));
        }
    }
}
