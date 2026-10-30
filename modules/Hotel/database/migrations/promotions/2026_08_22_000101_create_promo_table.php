<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotel_promotions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('hotel_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('code')->nullable();

            $table->date('start_date');
            $table->date('end_date');

            $table->unsignedInteger('priority')->default(0);

            $table->boolean('is_active')->default(true);

            $table->text('description')->nullable();

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

            $table->unique(['hotel_id', 'code']);
        });

        Schema::create('rate_plans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('hotel_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('name');
            $table->string('code');

            $table->text('description')->nullable();

            $table->boolean('is_active')
                ->default(true);

            $table->unsignedInteger('priority')
                ->default(0);

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

            $table->unique([
                'hotel_id',
                'code',
            ]);
        });

        Schema::create('promotion_rules', function (Blueprint $table) {
            $table->id();

            $table->foreignId('promotion_id')
                ->constrained('hotel_promotions')
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('type');

            $table->string('operator', 20)
                ->nullable();

            $table->json('value')
                ->nullable();

            $table->unsignedInteger('sort_order')
                ->default(0);

            $table->timestamps();

            $table->index(['promotion_id', 'type']);
        });

        Schema::create('promotion_benefits', function (Blueprint $table) {
            $table->id();

            $table->foreignId('promotion_id')
                ->constrained('hotel_promotions')
                ->cascadeOnDelete();

            $table->unsignedTinyInteger('type');

            $table->json('value')
                ->nullable();

            $table->unsignedInteger('sort_order')
                ->default(0);

            $table->timestamps();

            $table->index(['promotion_id', 'type']);
        });

        Schema::create('promotion_room_types', function (Blueprint $table) {
            $table->id();

            $table->foreignId('promotion_id')
                ->constrained('hotel_promotions')
                ->cascadeOnDelete();

            $table->foreignId('room_type_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unique([
                'promotion_id',
                'room_type_id',
            ]);
        });

        Schema::create('promotion_rate_plans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('promotion_id')
                ->constrained('hotel_promotions')
                ->cascadeOnDelete();

            $table->foreignId('rate_plan_id')
                ->constrained('rate_plans')
                ->cascadeOnDelete();

            $table->unique([
                'promotion_id',
                'rate_plan_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_rate_plans');
        Schema::dropIfExists('promotion_room_types');
        Schema::dropIfExists('promotion_benefits');
        Schema::dropIfExists('promotion_rules');
        Schema::dropIfExists('hotel_promotions');
    }
};
