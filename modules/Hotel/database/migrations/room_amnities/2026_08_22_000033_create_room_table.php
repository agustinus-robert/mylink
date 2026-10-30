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

            $table->foreignId('hotel_id')
                ->nullable()
                ->constrained('hotels');

            $table->foreignId('building_id')
                ->nullable()
                ->constrained('hotel_buildings');

            $table->foreignId('floor_id')
                ->nullable()
                ->constrained('hotel_floors');

            $table->foreignId('room_type_id')
                ->nullable()
                ->constrained('room_types');

            $table->integer('room_number');
            $table->integer('status');
            $table->integer('housekeeping_status');

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users');

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users');

            $table->foreignId('deleted_by')
                ->nullable()
                ->constrained('users');

            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('room_type_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_type_id')
                ->nullable()
                ->constrained('room_types');
            $table->text("images");
            $table->tinyInteger("order");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
        Schema::dropIfExists('room_type_images');
    }
};
