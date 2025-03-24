<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->integer('latest_rate_availed_id')->after('expected_check_out');
            $table->dateTime('check_in')->change();
            $table->dateTime('check_out')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('latest_rate_availed_id');
            $table->timestamp('check_in')->change(); // Revert back to timestamp
            $table->timestamp('check_out')->nullable()->change();
        });
    }
};
