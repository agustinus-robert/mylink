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
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('slug');
            $table->string('code');
            $table->string('phone');
            $table->string('email');
            $table->text('address');

            $table->foreignId('city_id')
                ->nullable()
                ->constrained('ref_cities');
            $table->foreignId('regency_id')
                ->nullable()
                ->constrained('ref_regencies');
            $table->foreignId('country_id')
                ->nullable()
                ->constrained('ref_provinces');

            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

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

        Schema::create('hotel_buildings', function (Blueprint $table) {
            $table->id();

            $table->string('code');
            $table->foreignId('hotel_id')
                ->nullable()
                ->constrained('hotels');

            $table->string('name');
            $table->string('slug');
            $table->text('description');

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

        Schema::create('hotel_floors', function (Blueprint $table) {
            $table->id();

            $table->foreignId('building_id')
                ->nullable()
                ->constrained('hotel_buildings');

            $table->foreignId('hotel_id')
                ->nullable()
                ->constrained('hotels');

            $table->integer('floor_number');
            $table->string('name');
            $table->string('slug');
            $table->text('description');

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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
        Schema::dropIfExists('hotel_buildings');
    }
};
