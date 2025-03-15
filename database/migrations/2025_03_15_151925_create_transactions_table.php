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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_officer');
            $table->timestamp('check_in');
            $table->timestamp('check_out')->nullable();
            $table->dateTime('expected_check_out');
            $table->integer('number_of_hours');
            $table->integer('number_of_days');
            $table->json('stay_extention')->nullable();
            $table->decimal('rate', 8, 2);
            $table->string('room_number');
            $table->string('customer_name');
            $table->string('customer_address');
            $table->string('customer_contact_number')->nullable();
            $table->string('id_picture_path')->nullable();
            $table->json('room_additions')->nullable();
            $table->decimal('total_payment', 10, 2);
            $table->json('missing_items')->nullable();
            $table->string('damaged_items')->nullable();
            $table->decimal('settlement_payment', 10, 2)->nullable();
            $table->decimal('overtime_charge', 8, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
