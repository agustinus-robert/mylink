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
        Schema::create('housekeeping_task_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');

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

        Schema::create('housekeeping_tasks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('room_id')
                ->nullable()
                ->constrained('folios');

            $table->foreignId('haousekeeping_task_id')
                ->nullable()
                ->constrained('housekeeping_task_categories');

            $table->tinyInteger("status");
            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users');
            $table->dateTime('started_at');
            $table->dateTime('completed_at');
            $table->text('notes');

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
        Schema::dropIfExists('housekeeping_task_categories');
        Schema::dropIfExists('housekeeping_tasks');
    }
};
