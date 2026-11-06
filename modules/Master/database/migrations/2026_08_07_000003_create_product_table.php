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
        Schema::create('mst_products', function (Blueprint $table) {
            $table->id();

            $table->string('code');
            $table->text('name');
            $table->text('slug');
            $table->string('link');
            $table->string('affiliate_link');
            
            $table->foreignId('category_id')
                ->nullable()
                ->constrained('mst_categories')
                ->cascadeOnDelete();

            $table->foreignId('sub_category_id')
                ->nullable()
                ->constrained('mst_sub_categories')
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

            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('mst_topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained('mst_products')
                ->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('mst_locations', function (Blueprint $table) {
            $table->id();

            $table->string('address')->nullable();
            $table->foreignId('province_id')
                ->constrained('location_province')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('district_id')
                ->constrained('location_city')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

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

        Schema::create('trx_product_prices', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->nullable()
                ->constrained('mst_products')
                ->cascadeOnDelete();

            $table->foreignId('location_id')
                ->nullable()
                ->constrained('mst_locations')
                ->cascadeOnDelete();

            $table->decimal('prices', 20, 2);
            $table->dateTime('recorded_at');

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
