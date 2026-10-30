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
        Schema::create('stays', function (Blueprint $table) {
            $table->id();

            $table->foreignId('reservation_id')
                ->nullable()
                ->constrained('reservations');

            $table->foreignId('guest_id')
                ->nullable()
                ->constrained('guests');

            $table->foreignId('room_id')
                ->nullable()
                ->constrained('rooms');

            $table->dateTime('actual_check_in');
            $table->dateTime('actual_check_out');

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

        Schema::create('stay_guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stay_id')
                ->nullable()
                ->constrained('stays');

            $table->foreignId('guest_id')
                ->nullable()
                ->constrained('guests');

            $table->tinyInteger('is_primary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
        Schema::dropIfExists('room_type_amenities');
        Schema::dropIfExists('room_type_images');
    }
};
