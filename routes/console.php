<?php

use Illuminate\Foundation\Console\ClosureCommand;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Artisan::command('inspire', function () {
//     /** @var ClosureCommand $this */
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote');

Schedule::command('check-reservations')
    ->everyFiveSeconds()
    ->timezone('Asia/Manila')
    ->sendOutputTo(storage_path('logs/reservation-check.log')); // Log to file instead