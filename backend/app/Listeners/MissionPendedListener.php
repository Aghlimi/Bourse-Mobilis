<?php

namespace App\Listeners;

use App\Events\MissionPendedEvent;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class MissionPendedListener implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct() {}

    /**
     * Handle the event.
     */
    public function handle(MissionPendedEvent $event): void
    {
        $operators = User::where("role", "operator")->get();
        foreach ($operators as $operator) {
            if ($operator) {
                $operator->notify(
                    new \App\Notifications\MissionPendedNotification(
                        $event->mission,
                    ),
                );
            }
        }
    }
}
