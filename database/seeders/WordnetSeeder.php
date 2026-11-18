<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use SplFileObject;

class WordNetSeeder extends Seeder
{
    public function run(): void
    {
        $path = storage_path('app/wordnet/wn-msa-all.tab');

        if (!file_exists($path)) {
            throw new RuntimeException(
                "WordNet dataset tidak ditemukan: {$path}"
            );
        }

        $this->command->info('Importing WordNet dataset...');

        $file = new SplFileObject($path, 'r');

        $languages = ['I', 'M'];

        $batchSize = 1000;

        $synsets = [];
        $words = [];

        $totalWords = 0;
        $totalSynsets = 0;
        $totalSkipped = 0;

        $now = now();

        while (!$file->eof()) {
            $line = $file->fgets();

            if (trim($line) === '') {
                continue;
            }

            $columns = explode("\t", rtrim($line, "\r\n"));

            if (count($columns) !== 4) {
                $totalSkipped++;
                continue;
            }

            [$synsetCode, $languageCode, $goodness, $lemma] = $columns;

            $synsetCode = trim($synsetCode);
            $languageCode = trim($languageCode);
            $goodness = trim($goodness);
            $lemma = trim($lemma);

            if (!in_array($languageCode, $languages, true)) {
                continue;
            }

            if ($synsetCode === '' || $lemma === '') {
                $totalSkipped++;
                continue;
            }

            $separator = strrpos($synsetCode, '-');

            if ($separator === false) {
                $totalSkipped++;
                continue;
            }

            $partOfSpeech = substr($synsetCode, $separator + 1);

            $synsets[$synsetCode] = [
                'synset_code' => $synsetCode,
                'part_of_speech' => $partOfSpeech,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $words[] = [
                'synset_code' => $synsetCode,
                'lemma' => $lemma,
                'language_code' => $languageCode,
                'goodness' => $goodness,
            ];

            if (count($words) >= $batchSize) {
                $this->importBatch($synsets, $words);

                $totalWords += count($words);
                $totalSynsets += count($synsets);

                $this->command->info(
                    "Imported {$totalWords} words..."
                );

                $synsets = [];
                $words = [];
            }
        }

        if (!empty($words)) {
            $this->importBatch($synsets, $words);

            $totalWords += count($words);
            $totalSynsets += count($synsets);
        }

        $this->command->newLine();

        $this->command->table(
            ['Information', 'Total'],
            [
                ['Languages', implode(', ', $languages)],
                ['Imported words', number_format($totalWords)],
                ['Processed synsets', number_format($totalSynsets)],
                ['Skipped invalid rows', number_format($totalSkipped)],
            ]
        );

        $this->command->info('WordNet import completed.');
    }

    private function importBatch(array $synsets, array $words): void
    {
        DB::transaction(function () use ($synsets, $words) {

            DB::table('mst_wordnet_synsets')->upsert(
                array_values($synsets),
                ['synset_code'],
                ['part_of_speech', 'updated_at']
            );

            $synsetCodes = array_unique(
                array_column($words, 'synset_code')
            );

            $synsetIds = DB::table('mst_wordnet_synsets')
                ->whereIn('synset_code', $synsetCodes)
                ->pluck('id', 'synset_code');

            $wordRecords = [];

            foreach ($words as $word) {
                if (!isset($synsetIds[$word['synset_code']])) {
                    continue;
                }

                $wordRecords[] = [
                    'wordnet_synset_id' => $synsetIds[$word['synset_code']],
                    'lemma' => $word['lemma'],
                    'language_code' => $word['language_code'],
                    'goodness' => $word['goodness'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if (!empty($wordRecords)) {
                DB::table('mst_wordnet_words')->upsert(
                    $wordRecords,
                    [
                        'wordnet_synset_id',
                        'lemma',
                        'language_code',
                    ],
                    ['goodness', 'updated_at']
                );
            }
        });
    }
}
