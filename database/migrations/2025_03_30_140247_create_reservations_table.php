<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->integer('reserved_room_id');
            $table->json('room_additions')->nullable();
            $table->integer('rate_availed_id');
            $table->dateTime('check_in_datetime');
            $table->dateTime('expected_check_out');
            $table->integer('number_of_hours');
            $table->integer('number_of_days');
            $table->string('guest_name');
            $table->string('guest_address');
            $table->string('guest_contact_number');
            $table->decimal('total_payment', 10, 2);
            $table->decimal('pending_payment', 10, 2);
            $table->string('transaction_officer');
            $table->string('reservation_status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
