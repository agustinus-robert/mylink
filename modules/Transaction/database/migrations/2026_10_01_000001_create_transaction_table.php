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
        Schema::create('transaction_incomings', function (Blueprint $table) {
            $table->id();
            $table->tinyText('code');
            $table->text('name');
            $table->text('slug');

            $table->foreignId('category_id')
                ->nullable()
                ->constrained('mst_categories')
                ->cascadeOnDelete();

            $table->foreignId('sub_category_id')
                ->nullable()
                ->constrained('mst_sub_categories')
                ->cascadeOnDelete();

            $table->text('link')->nullable();
            $table->text('link_affiliate')->nullable();
            $table->decimal('grand_total', 15, 2);

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

        Schema::create('transaction_incoming_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incoming_id')
                ->constrained('transaction_incomings')
                ->cascadeOnDelete();

            $table->string('name');
            $table->decimal('harga', 15, 0);
            $table->unsignedInteger('qty');
            $table->string('uom');
            $table->decimal('total', 15, 0);
            $table->date('expired')->nullable(false)->change();

            
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
        Schema::dropIfExists('users');
    }
};
