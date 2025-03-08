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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('item_name');
            $table->enum('item_type',['room amenity','consumable']);
            $table->integer('available');
            $table->integer('in_use')->nullable();
            $table->integer('in_process')->nullable();
            $table->integer('sold')->nullable();
            $table->integer('missing')->nullable();
            $table->decimal('price', 8, 2);
            $table->enum('status',['active','in-active'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
