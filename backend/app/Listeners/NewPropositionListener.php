<?php

namespace App\Listeners;

use App\Events\NewPropositionEvent;
use App\Notifications\NewPropositionNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NewPropositionListener implements ShouldQueue
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
    public function handle(NewPropositionEvent $event): void
    {
        $user = $event->proposal->mission->createdBy;
        if ($user) {
            $user->notify(new NewPropositionNotification($mission));
        }
    }
}
