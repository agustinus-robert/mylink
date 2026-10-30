<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100);
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

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['name']);
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100);
            $table->string('group', 100)->nullable();
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

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('role_users', function (Blueprint $table) {
            $table->id();

            $table->foreignId('role_id')
                ->constrained('roles')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users');

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users');

            $table->foreignId('deleted_by')
                ->nullable()
                ->constrained('users');

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['role_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
