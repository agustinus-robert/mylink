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
        Schema::create('guests', function (Blueprint $table) {
            $table->id();

            $table->string('first_name');
            $table->string('last_name');
            $table->string('gender');
            $table->string('date_of_birth');
            $table->string('nationality');
            $table->string('phone');
            $table->string('email');
            $table->text('address');

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

        Schema::create('guest_documents', function (Blueprint $table) {
            $table->foreignId('guest_id')
                ->nullable()
                ->constrained('guests');

            $table->tinyInteger('document_type');
            $table->tinyInteger('document_number');
            $table->string('issued_country');
            $table->date('issued_at');
            $table->boolean('is_primary')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
