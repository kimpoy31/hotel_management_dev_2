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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_number')->unique();
            $table->string('room_type');
            $table->json('room_rate_ids');
            $table->json('room_inclusions')->nullable();
            $table->enum('room_status', [
                'available',
                'occupied',
                'pending_inspection',
                'pending_settlement',
                'cleaning',
                'reserved',
                'out_of_service',
                'under_maintenance',
                'no_show',
                'blocked',
            ])->default('available');
            $table->integer('active_transaction')->nullable();
            $table->enum('status',['active','in-active'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
