<?php

namespace App\Listeners;

use App\Events\PropositionRejectedEvent;
use App\Notifications\PropositionRejectedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class PropositionRejectedListener implements ShouldQueue
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
    public function handle(PropositionRejectedEvent $event): void
    {
        $user = $event->proposal->user;
        if ($user) {
            $user->notify(new PropositionRejectedNotification($mission));
        }
    }
}
