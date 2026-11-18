<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mst_wordnet_synsets', function (Blueprint $table) {
            $table->id();

            $table->string('synset_code', 20)->unique();
            $table->char('part_of_speech', 1)->nullable();
            $table->timestamps();

            $table->index('part_of_speech');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mst_wordnet_synsets');
    }
};