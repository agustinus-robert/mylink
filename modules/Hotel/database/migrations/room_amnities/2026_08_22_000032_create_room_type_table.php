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
        Schema::create('room_types', function (Blueprint $table) {
            $table->id();

            $table->foreignId('hotel_id')
                ->nullable()
                ->constrained('hotels');

            $table->string('name');
            $table->string('slug');
            $table->string('code');
            $table->text('description');
            $table->integer('max_adults');
            $table->integer('max_children');
            $table->integer('max_occupancy');
            $table->integer('bed_type');
            $table->integer('bed_count');
            $table->integer('size');
            $table->integer('status');

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

        Schema::create('room_type_amenities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('amenities_id')
                ->nullable()
                ->constrained('amenities');

            $table->foreignId('room_type_id')
                ->nullable()
                ->constrained('room_types');
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
