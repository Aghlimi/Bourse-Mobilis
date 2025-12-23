<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewPropositionNotification extends Notification
{
    use Queueable;

    public $mission;

    /**
     * Create a new notification instance.
     */
    public function __construct($mission)
    {
        $this->mission = $mission;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Proposal for Your Mission')
            ->line('You have received a new proposal for your mission.')
            ->line('Mission: ' . $this->mission->title)
            ->line('From: ' . $this->mission->from . ' To: ' . $this->mission->to)
            ->action('View Proposals', url('/dashboard/missions/' . $this->mission->id . '/proposals'))
            ->line('Review the proposal and accept or reject it.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
