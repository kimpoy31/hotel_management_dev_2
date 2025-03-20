<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            // Drop the unique constraint if it exists
            $table->dropUnique('rooms_room_number_unique');
        });
    }

    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            // Restore the unique constraint in the down() method
            $table->unique('room_number', 'rooms_room_number_unique');
        });
    }
};
