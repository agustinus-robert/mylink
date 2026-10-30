<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')
                ->constrained('roles')
                ->cascadeOnDelete();

            $table->foreignId('permission_id')
                ->constrained('permissions')
                ->cascadeOnDelete();

            $table->boolean('can_create')->default(false);
            $table->boolean('can_read')->default(false);
            $table->boolean('can_update')->default(false);
            $table->boolean('can_delete')->default(false);

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

            $table->unique(['role_id', 'permission_id']);
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_permissions');
    }
};
