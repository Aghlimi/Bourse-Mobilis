<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PropositionRejectedNotification extends Notification
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
            ->subject('Your Proposal Has Been Rejected')
            ->line('Unfortunately, your proposal has been rejected.')
            ->line('Mission: ' . $this->mission->title)
            ->line('From: ' . $this->mission->from . ' To: ' . $this->mission->to)
            ->action('Browse Other Missions', url('/dashboard/missions'))
            ->line('Don\'t give up! There are more missions waiting for you.');
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
