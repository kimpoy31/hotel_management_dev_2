<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $recipients;
    public $title;
    public $description;
    public $notif_id;
    public $room_number;
    public $is_db_driven;

    /**
     * Create a new event instance.
     */
    public function __construct($recipients, string $title, string $description, int $notif_id, string $room_number, bool $is_db_driven)
    {
        $this->recipients = $recipients;
        $this->title = $title;
        $this->description = $description;
        $this->notif_id = $notif_id;
        $this->room_number = $room_number;
        $this->is_db_driven = $is_db_driven;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return collect($this->recipients)
            ->map(fn ($recipient) => new PrivateChannel("notification.{$recipient}"))
            ->toArray();
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'notif_id' => $this->notif_id,
            'room_number' => $this->room_number,
            'is_db_driven' => $this->is_db_driven,
        ];
    }
}