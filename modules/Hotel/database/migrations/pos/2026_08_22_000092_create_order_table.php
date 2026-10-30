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
        Schema::create('product_orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('table_id')
                ->nullable()
                ->constrained('tables');

            $table->foreignId('outlet_id')
                ->nullable()
                ->constrained('outlets');

            $table->foreignId('stay_id')
                ->nullable()
                ->constrained('stays');

            $table->foreignId('folio_id')
                ->nullable()
                ->constrained('folios');

            $table->string('order_number');
            $table->tinyInteger('status');
            $table->integer('total');

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

        Schema::create('product_order_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->nullable()
                ->constrained('product_orders');

            $table->foreignId('product_id')
                ->nullable()
                ->constrained('products');

            $table->integer('quantity');
            $table->decimal('price', 20, 2);
            $table->decimal('discount', 20, 2);
            $table->decimal('total', 20, 2);

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
        Schema::dropIfExists('maintenance_categories');
        Schema::dropIfExists('maintenance_requests');
    }
};
