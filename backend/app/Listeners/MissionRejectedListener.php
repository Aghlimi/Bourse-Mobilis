<?php

namespace App\Listeners;

use App\Events\MissionRejectedEvent;
use App\Notifications\MissionRejectedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class MissionRejectedListener implements ShouldQueue
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
    public function handle(MissionRejectedEvent $event): void
    {
        $mission = $event->mission;
        $user = $mission->createdBy;
        if ($user) {
            $user->notify(new MissionRejectedNotification($mission));
        }
    }
}
