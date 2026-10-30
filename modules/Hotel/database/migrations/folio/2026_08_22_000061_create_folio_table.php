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
        Schema::create('folio_transaction_types', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('slug');
        });

        Schema::create('folios', function (Blueprint $table) {
            $table->id();

            $table->foreignId('stay_id')
                ->nullable()
                ->constrained('stays');

            $table->foreignId('guest_id')
                ->nullable()
                ->constrained('guests');

            $table->string('reference_number');
            $table->tinyInteger('status');
            $table->decimal('total', 20, 2);
            $table->decimal('paid', 20, 2);
            $table->decimal('balance', 20, 2);

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

        Schema::create('folio_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('folio_id')
                ->nullable()
                ->constrained('folios');

            $table->foreignId('transaction_type_id')
                ->nullable()
                ->constrained('folio_transaction_types');

            $table->text('description');
            $table->integer('quantity');
            $table->decimal('unit_price');
            $table->float('discount', 2);
            $table->float('tax', 2);
            $table->decimal('total', 20, 2);
            $table->dateTime('posted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('folios');
    }
};
