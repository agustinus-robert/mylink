<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mst_wordnet_words', function (Blueprint $table) {
            $table->id();

            $table->foreignId('wordnet_synset_id')
                ->constrained('mst_wordnet_synsets')
                ->cascadeOnDelete();
            $table->string('lemma', 255);
            $table->char('language_code', 1);
            $table->char('goodness', 1);

            $table->timestamps();

            $table->index('lemma');
            $table->index('language_code');
            $table->index('goodness');
            $table->index(
                ['lemma', 'language_code', 'goodness'],
                'wordnet_lookup_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mst_wordnet_words');
    }
};