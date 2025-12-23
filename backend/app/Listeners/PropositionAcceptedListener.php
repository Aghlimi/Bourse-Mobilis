<?php

namespace App\Listeners;

use App\Events\PropositionAcceptedEvent;
use App\Notifications\PropositionAcceptedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class PropositionAcceptedListener implements ShouldQueue
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
    public function handle(PropositionAcceptedEvent $event): void
    {
        $user = $event->proposal->user;
        if ($user) {
            $user->notify(new PropositionAcceptedNotification($mission));
        }
    }
}
