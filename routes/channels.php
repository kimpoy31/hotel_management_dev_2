<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('rooms.status', function ($user) {
    return true; // or add additional authorization logic
});

Broadcast::channel('notification.{recipient}', function ($user, $recipient) {
    return in_array($recipient, $user->roles) || in_array('administrator', $user->roles);
});