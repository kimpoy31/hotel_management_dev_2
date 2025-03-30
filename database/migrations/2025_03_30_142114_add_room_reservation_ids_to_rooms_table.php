<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->json('room_reservation_ids')->nullable()->after('active_transaction'); // Replace 'column_name' with the existing column after which this should be placed
        });
    }

    public function down()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn('room_reservation_ids');
        });
    }
};

