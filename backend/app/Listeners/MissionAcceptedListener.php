<?php

namespace App\Listeners;

use App\Events\MissionAcceptedEvent;
use App\Notifications\MissionAcceptedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class MissionAcceptedListener implements shouldQueue
{
    public function __construct() {}

    public function handle(MissionAcceptedEvent $event): void
    {
        $mission = $event->mission;
        $user = $mission->createdBy()->first();
        if ($user) {
            $user->notify(new MissionAcceptedNotification($mission));
        }
    }
}
