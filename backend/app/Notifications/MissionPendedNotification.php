<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class MissionPendedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $mission;
    public function __construct($mission)
    {
        $this->mission = $mission;
        //
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

        Log::info('Preparing to send MissionPendedNotification email for mission ID: ' . $this->mission->id);
        return (new MailMessage)
            ->subject('New Mission Pending Approval')
            ->line('A new mission has been created and is pending approval.')
            ->line('Mission: ' . $this->mission->title)
            ->action('View Mission', url('/dashboard/missions/' . $this->mission->id))
            ->line('Please review this mission at your earliest convenience.');
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
