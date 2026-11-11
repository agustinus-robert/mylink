<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Modules\Master\Models\Category;
use Modules\Master\Models\Regency;
use Modules\Transaction\Models\Product;
use Modules\Transaction\Models\ProductLocation;
use Modules\Transaction\Models\ProductPrice;
use Modules\Transaction\Models\Topics;

class AffiliateCommand extends Command
{
    protected $signature = 'app:affiliate-command
                            {file : Nama file CSV di storage/app}
                            {category : Nama kategori produk}';

    protected $description = 'Import produk Shopee Affiliate dari CSV';

    /**
     * Parse satu baris CSV Shopee.
     *
     * Menangani format:
     * "Product ID,""Shop ID"",""Nama Produk""..."
     *
     * serta format CSV standar.
     */
    private function parseCsvLine(string $line): array
    {
        $line = rtrim($line, "\r\n");

        // Hilangkan BOM jika ada.
        $line = preg_replace('/^\xEF\xBB\xBF/', '', $line);

        // Periksa apakah seluruh baris dibungkus tanda kutip.
        if (
            strlen($line) >= 2 &&
            str_starts_with($line, '"') &&
            str_ends_with($line, '"')
        ) {
            // Lepaskan tanda kutip pembungkus.
            $line = substr($line, 1, -1);

            // Kembalikan tanda kutip internal.
            $line = str_replace('""', '"', $line);
        }

        return str_getcsv($line, ',', '"', '');
    }

    public function handle(): int
    {
        $fileName = $this->argument('file');
        $categoryName = trim($this->argument('category'));

        // =====================================
        // VALIDASI FILE
        // =====================================

        if (
            basename($fileName) !== $fileName ||
            !str_ends_with(strtolower($fileName), '.csv')
        ) {
            $this->error('Masukkan nama file CSV yang valid.');

            return self::FAILURE;
        }

        if ($categoryName === '') {
            $this->error('Nama kategori tidak boleh kosong.');

            return self::FAILURE;
        }

        $filePath = storage_path('app/' . $fileName);

        if (!file_exists($filePath)) {
            $this->error("File CSV tidak ditemukan: {$filePath}");

            return self::FAILURE;
        }

        $file = fopen($filePath, 'r');

        if (!$file) {
            $this->error('Gagal membuka file CSV.');

            return self::FAILURE;
        }

        // =====================================
        // BACA HEADER CSV
        // =====================================

        $headerLine = fgets($file);

        $headers = $headerLine !== false
            ? $this->parseCsvLine($headerLine)
            : false;

        if (!$headers) {
            $this->error('Header CSV tidak ditemukan.');
            fclose($file);

            return self::FAILURE;
        }

        // Normalisasi BOM dan spasi header.
        $headers = array_map(function ($header) {
            $header = preg_replace(
                '/^\xEF\xBB\xBF/',
                '',
                (string) $header
            );

            return trim(preg_replace('/\s+/', ' ', $header));
        }, $headers);

        // Normalisasi nama header agar konsisten.
        $canonicalHeaders = [
            'product id' => 'Product ID',
            'shop id' => 'Shop ID',
            'nama produk' => 'Nama Produk',
            'kategori' => 'Kategori',
            'harga' => 'Harga',
            'harga asli' => 'Harga Asli',
            'stok' => 'Stok',
            'terjual' => 'Terjual',
            'rating' => 'Rating',
            'ulasan' => 'Ulasan',
            'liked count' => 'Liked Count',
            'tanggal upload' => 'Tanggal Upload',
            'komisi' => 'Komisi',
            'estimasi komisi' => 'Estimasi Komisi',
            'toko' => 'Toko',
            'link produk' => 'Link Produk',
            'image 1' => 'Image 1',
            'image 2' => 'Image 2',
            'image 3' => 'Image 3',
            'image 4' => 'Image 4',
            'image 5' => 'Image 5',
            'image 6' => 'Image 6',
            'image 7' => 'Image 7',
            'image 8' => 'Image 8',
            'image 9' => 'Image 9',
            'videos' => 'Videos',
            'sample gratis' => 'Sample Gratis',
            'komisi maksimal' => 'Komisi Maksimal',
            'komisi seller' => 'Komisi Seller',
            'lokasi toko' => 'Lokasi Toko',
            'rating toko' => 'Rating Toko',
            'jumlah penilaian toko' => 'Jumlah Penilaian Toko',
            'currency' => 'Currency',
            'hashtag' => 'Hashtag',
            'keyword' => 'Keyword',
        ];

        $headers = array_map(function ($header) use ($canonicalHeaders) {
            $key = Str::lower(trim($header));

            return $canonicalHeaders[$key] ?? $header;
        }, $headers);

        $totalColumns = count($headers);

        // Cari posisi kolom penting.
        $nameIndex = array_search('Nama Produk', $headers, true);

        $requiredHeaders = [
            'Nama Produk',
            'Link Produk',
        ];

        foreach ($requiredHeaders as $required) {
            if (!in_array($required, $headers, true)) {
                $this->error("Header CSV tidak ditemukan: {$required}");

                $this->line(
                    'Header terbaca: ' . implode(' | ', $headers)
                );

                fclose($file);

                return self::FAILURE;
            }
        }

        $this->info("Jumlah header: {$totalColumns}");
        $this->info("Index Nama Produk: {$nameIndex}");
        $this->info("Kategori: {$categoryName}");
        $this->info('Memulai import CSV...');

        // =====================================
        // COUNTER
        // =====================================

        $success = 0;
        $skipped = 0;
        $failed = 0;
        $rowNumber = 1;

        // =====================================
        // BACA SETIAP BARIS CSV
        // =====================================

        while (($line = fgets($file)) !== false) {
            $rowNumber++;

            if (trim($line) === '') {
                continue;
            }

            // Parse baris menggunakan parser yang sama.
            $row = $this->parseCsvLine($line);

            // =====================================
            // PERBAIKI KOLOM NAMA PRODUK
            // =====================================

            // Jika terdapat koma tanpa tanda kutip pada nama produk,
            // gabungkan kembali ke kolom Nama Produk.
            if (count($row) > $totalColumns) {
                $extraColumns = count($row) - $totalColumns;

                $productNameParts = array_slice(
                    $row,
                    $nameIndex,
                    $extraColumns + 1
                );

                $productName = implode(',', $productNameParts);

                array_splice(
                    $row,
                    $nameIndex,
                    $extraColumns + 1,
                    [$productName]
                );
            }

            // =====================================
            // VALIDASI JUMLAH KOLOM
            // =====================================

            if (count($row) !== $totalColumns) {
                $failed++;

                $this->newLine();
                $this->error(
                    "Baris {$rowNumber}: Jumlah kolom tidak cocok."
                );

                $this->line('Header: ' . $totalColumns);
                $this->line('Data  : ' . count($row));
                $this->line('Isi   : ' . substr($line, 0, 300));

                continue;
            }

            // =====================================
            // GABUNGKAN HEADER DAN DATA
            // =====================================

            $data = array_combine($headers, $row);

            $productName = trim($data['Nama Produk'] ?? '');

            $step = 'Memulai transaksi';

            $this->newLine();
            $this->info("Memproses baris {$rowNumber}: {$productName}");

            try {
                $result = DB::transaction(function () use (
                    $data,
                    &$step,
                    $categoryName
                ) {
                    // =====================================
                    // DATA PRODUK
                    // =====================================

                    $step = 'Membaca data CSV';

                    $name = trim($data['Nama Produk'] ?? '');
                    $linkImage = trim($data['Image 1'] ?? '');
                    $link = trim($data['Link Produk'] ?? '');

                    $keyword = trim($data['Hashtag'] ?? '');
                    $related = trim($data['Keyword'] ?? '');

                    $shopName = trim($data['Toko'] ?? '');
                    $locationName = trim($data['Lokasi Toko'] ?? '');

                    if ($name === '' || $link === '') {
                        throw new \RuntimeException(
                            'Nama produk atau link produk kosong.'
                        );
                    }

                    // =====================================
                    // CEK DUPLIKASI SLUG
                    // =====================================

                    $step = 'Mengecek duplikasi slug';

                    $slug = Str::slug($name);

                    if (
                        Product::withTrashed()
                            ->where('slug', $slug)
                            ->exists()
                    ) {
                        return false;
                    }

                    // =====================================
                    // CEK / INSERT CATEGORY
                    // =====================================

                    $step = "Mengecek kategori: {$categoryName}";

                    $category = Category::withTrashed()
                        ->whereRaw(
                            'LOWER(name) = ?',
                            [Str::lower($categoryName)]
                        )
                        ->first();

                    if ($category) {
                        if ($category->trashed()) {
                            $category->restore();
                        }
                    } else {
                        // Generate category code.
                        $step = 'Generate Category Code';

                        do {
                            $categoryCode = Str::upper(
                                Str::random(3)
                            );
                        } while (
                            Category::withTrashed()
                                ->where('code', $categoryCode)
                                ->exists()
                        );

                        // Insert category.
                        $step = 'Insert Category';

                        $category = Category::create([
                            'code' => $categoryCode,
                            'name' => $categoryName,
                        ]);
                    }

                    $categoryId = $category->id;

                    // =====================================
                    // HARGA DAN TANGGAL
                    // =====================================

                    $step = 'Membaca harga dan tanggal';

                    // Rp1.250.000 menjadi 1250000.
                    $price = (int) preg_replace(
                        '/\D+/',
                        '',
                        trim($data['Harga'] ?? '0')
                    );

                    $uploadDate = trim(
                        $data['Tanggal Upload'] ?? ''
                    );

                    // Jika tanggal kosong, gunakan tanggal hari ini.
                    if ($uploadDate === '') {
                        $recordedAt = now()->toDateString();
                    } else {
                        $date = Carbon::createFromFormat(
                            '!j/n/Y',
                            $uploadDate
                        );

                        if (!$date) {
                            throw new \RuntimeException(
                                "Format tanggal tidak valid: {$uploadDate}"
                            );
                        }

                        $recordedAt = $date->format('Y-m-d');
                    }

                    // =====================================
                    // GENERATE PRODUCT CODE
                    // =====================================

                    $step = 'Generate Product Code';

                    do {
                        $code = Str::upper(Str::random(3));
                    } while (
                        Product::withTrashed()
                            ->where('code', $code)
                            ->exists()
                    );

                    // =====================================
                    // INSERT PRODUCT
                    // =====================================

                    $step = 'Insert Product';

                    $product = Product::create([
                        'code' => $code,
                        'name' => $name,
                        'slug' => $slug,
                        'link' => $linkImage,
                        'affiliate_link' => $link,
                        'category_id' => $categoryId,
                        'related' => $related,
                    ]);

                    // =====================================
                    // INSERT TOPICS
                    // =====================================

                    $step = 'Insert Topics';

                    if ($keyword !== '') {
                        $keyword = preg_replace(
                            '/\s+/',
                            ',',
                            trim($keyword)
                        );

                        Topics::create([
                            'product_id' => $product->id,
                            'name' => $keyword,
                        ]);
                    }

                    // =====================================
                    // INSERT PRODUCT LOCATION
                    // =====================================

                    $step = 'Memproses lokasi toko';

                    $location = null;

                    if ($locationName !== '') {
                        $normalizedLocation = Str::upper(
                            Str::squish($locationName)
                        );

                        // Identifikasi jenis wilayah.
                        if (
                            preg_match(
                                '/^KABUPATEN\s+(.+)$/i',
                                $normalizedLocation,
                                $matches
                            ) ||
                            preg_match(
                                '/^KAB\.?\s+(.+)$/i',
                                $normalizedLocation,
                                $matches
                            )
                        ) {
                            $type = 'Kabupaten';
                            $cityName = trim($matches[1]);
                        } elseif (
                            preg_match(
                                '/^KOTA\s+(.+)$/i',
                                $normalizedLocation,
                                $matches
                            )
                        ) {
                            $type = 'Kota';
                            $cityName = trim($matches[1]);
                        } else {
                            throw new \RuntimeException(
                                "Format lokasi tidak dikenali: {$locationName}"
                            );
                        }

                        // Cari Regency.
                        $step = "Mencari Regency: {$type} {$cityName}";

                        $regency = Regency::query()
                            ->where('type', $type)
                            ->whereRaw(
                                'LOWER(city_name) = ?',
                                [Str::lower($cityName)]
                            )
                            ->first();

                        if (!$regency) {
                            throw new \RuntimeException(
                                "Wilayah tidak ditemukan: {$type} {$cityName}"
                            );
                        }

                        if ($shopName === '') {
                            throw new \RuntimeException(
                                'Kolom Toko kosong pada CSV.'
                            );
                        }

                        // Simpan toko ke mst_locations.
                        $step = 'Insert Product Location';

                        $location = ProductLocation::firstOrCreate([
                            'address' => $shopName,
                            'province_id' => $regency->province_id,
                            'district_id' => $regency->id,
                        ]);
                    }

                    // =====================================
                    // INSERT PRODUCT PRICE
                    // =====================================

                    $step = 'Insert Product Price';

                    if ($price > 0) {
                        ProductPrice::create([
                            'product_id' => $product->id,
                            'location_id' => $location?->id,
                            'prices' => $price,
                            'recorded_at' => $recordedAt,
                        ]);
                    }

                    $step = 'Selesai';

                    return true;
                });

                // =====================================
                // HASIL PER BARIS
                // =====================================

                if ($result) {
                    $success++;

                    $this->info('BERHASIL');
                } else {
                    $skipped++;

                    $this->comment(
                        'DILEWATI: Slug produk sudah tersedia.'
                    );
                }

            } catch (\Throwable $e) {
                $failed++;

                $this->newLine();
                $this->error('GAGAL IMPORT');

                $this->line("Baris   : {$rowNumber}");
                $this->line("Produk  : {$productName}");
                $this->line("Proses  : {$step}");
                $this->line("Error   : {$e->getMessage()}");
                $this->line("File    : {$e->getFile()}");
                $this->line("Line    : {$e->getLine()}");

                report($e);
            }
        }

        fclose($file);

        // =====================================
        // HASIL IMPORT
        // =====================================

        $this->newLine();
        $this->info('=================================');
        $this->info('IMPORT SELESAI');
        $this->info('=================================');

        $this->info("Berhasil : {$success}");
        $this->comment("Dilewati : {$skipped}");
        $this->error("Gagal    : {$failed}");

        $this->info('=================================');

        return self::SUCCESS;
    }
}
