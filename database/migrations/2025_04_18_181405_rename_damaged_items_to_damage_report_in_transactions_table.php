<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Change to LONGTEXT and make nullable first
            $table->longText('damaged_items')->nullable()->change();
            
            // Then rename the column
            $table->renameColumn('damaged_items', 'damage_report');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('transactions', function (Blueprint $table) {
            // First rename back
            $table->renameColumn('damage_report', 'damaged_items');
            
            // Then change type back to VARCHAR (assuming it was VARCHAR(255))
            $table->string('damaged_items', 255)->nullable()->change();
        });
    }
};
