<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop existing unique index if it exists
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropUnique('rooms_room_number_unique');
        });

        // Create a composite unique index on room_number and status
        Schema::table('rooms', function (Blueprint $table) {
            $table->unique(['room_number', 'status'], 'rooms_room_number_status_unique');
        });

        // Create a trigger to enforce the "status != in-active" rule
        DB::unprepared('
            CREATE TRIGGER enforce_unique_active_room_number 
            BEFORE INSERT ON rooms 
            FOR EACH ROW 
            BEGIN
                IF NEW.status != "in-active" AND EXISTS (
                    SELECT 1 FROM rooms 
                    WHERE room_number = NEW.room_number 
                    AND status != "in-active"
                ) THEN
                    SIGNAL SQLSTATE "45000" 
                    SET MESSAGE_TEXT = "Duplicate room number for active room";
                END IF;
            END
        ');
    }

    public function down(): void
    {
        // Drop the trigger and the composite index
        DB::unprepared('DROP TRIGGER IF EXISTS enforce_unique_active_room_number');
        
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropUnique('rooms_room_number_status_unique');
        });

        // Restore the original unique index
        Schema::table('rooms', function (Blueprint $table) {
            $table->unique('room_number');
        });
    }
};

