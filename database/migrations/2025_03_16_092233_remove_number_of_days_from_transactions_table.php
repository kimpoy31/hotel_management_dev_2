<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('number_of_days');
            $table->dropColumn('stay_extention');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->integer('number_of_days'); // Restore column if rolled back
            $table->json('stay_extention')->nullable();
        });
    }
};

