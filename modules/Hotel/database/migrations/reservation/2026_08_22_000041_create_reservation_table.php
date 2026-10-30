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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('hotel_id')
                ->nullable()
                ->constrained('hotels');

            $table->foreignId('guest_id')
                ->nullable()
                ->constrained('guests');
            $table->string('reservation_number');

            $table->tinyInteger('status');
            $table->string('source');
            $table->dateTime('check_in');
            $table->dateTime('check_out');
            $table->integer('total_amount');
            $table->integer('notes');

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

        Schema::create('reservation_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')
                ->nullable()
                ->constrained('reservations');

            $table->foreignId('room_id')
                ->nullable()
                ->constrained('rooms');

            $table->foreignId('room_type_id')
                ->nullable()
                ->constrained('room_types');

            $table->integer('adults');
            $table->integer('children');
            $table->dateTime('check_in');
            $table->dateTime('check_out');
            $table->integer('rate');
            $table->integer('discount');
            $table->integer('tax');
            $table->decimal('sub_total', 20, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('reservation_rooms');
    }
};
