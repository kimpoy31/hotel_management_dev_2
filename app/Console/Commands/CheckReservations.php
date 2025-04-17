<?php

namespace App\Console\Commands;

use App\Events\ReservedRoomStatusUpdated;
use App\Events\RoomStatusUpdated;
use App\Models\GeneralSetting;
use App\Models\Rate;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-reservations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
        public function handle()
    {
        $now = Carbon::now('Asia/Manila'); // Keep this as a Carbon instance
        $formattedNow = $now->format('Y-m-d H:i'); // Format only for comparison

        $reservations = Reservation::where('reservation_status','pending')->get();

        foreach ($reservations as $reservation) {
            // Format check-in datetime to minute precision in PHT
            $check_in_time = Carbon::parse($reservation->check_in_datetime)
                                ->timezone('Asia/Manila')
                                ->format('Y-m-d H:i');

            $room = Room::find($reservation->reserved_room_id);
            $rate = Rate::find($reservation->rate_availed_id);
            // GENERAL SETTINGS
            $generalSettings = GeneralSetting::find(1);

            if ($room->room_status != 'available') {
                continue;
            }

            // Compare formatted datetimes for minute-precise match
            if ($check_in_time === $formattedNow) {
                $expected_checkout = $now->copy()->addHours((int) $reservation->number_of_hours);
    
                Transaction::create([
                    'transaction_officer' => $reservation->transaction_officer,
                    'check_in' => $now->timezone('UTC'),
                    'expected_check_out' => $expected_checkout->timezone('UTC'),
                    'number_of_hours' => $reservation->number_of_hours,
                    'latest_rate_availed_id' => $reservation->rate_availed_id,
                    'rate' => $rate->rate,
                    'room_number' => $room->room_number,
                    'customer_name' => $reservation->guest_name,
                    'customer_address' => $reservation->guest_address,
                    'customer_contact_number' => $reservation->guest_contact_number,
                    'id_picture_path' => null,
                    'room_additions' => $reservation->room_additions,
                    'total_payment' => $reservation->total_payment,
                    'overtime_charge' => $generalSettings->overtime_charge,
                    'pending_payment' => $reservation->pending_payment ?? null,
                ]);

                $reservation->update([
                    'reservation_status' => 'completed',
                ]);
                
                ReservedRoomStatusUpdated::dispatch('status_updated');
                RoomStatusUpdated::dispatch('status_updated');
            }
        }

        return Command::SUCCESS;
    }

}
