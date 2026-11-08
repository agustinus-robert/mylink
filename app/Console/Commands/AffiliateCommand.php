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

    public function handle(): int
    {
        $fileName = $this->argument('file');
        $categoryName = trim($this->argument('category'));

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

        // Baca header
        $headers = fgetcsv($file, 0, ',', '"', '');

        if (!$headers) {
            $this->error('Header CSV tidak ditemukan.');
            fclose($file);

            return self::FAILURE;
        }

        // Bersihkan BOM dan spasi header
        $headers = array_map(function ($header) {
            return trim(preg_replace('/^\xEF\xBB\xBF/', '', $header));
        }, $headers);

        $totalColumns = count($headers);

        $this->info("Jumlah header: {$totalColumns}");
        $this->info("Kategori: {$categoryName}");
        $this->info('Memulai import CSV...');

        $success = 0;
        $skipped = 0;
        $failed = 0;
        $rowNumber = 1;

        // Cache kategori agar tidak dicari berulang kali
        $categoryId = null;
        $categoryChecked = false;
        $categoryWarningShown = false;

        // Baca setiap baris CSV
        while (($line = fgets($file)) !== false) {
            $rowNumber++;

            $line = trim($line);

            if ($line === '') {
                continue;
            }

            // Normalisasi pembungkus seluruh baris CSV Shopee
            if (
                str_starts_with($line, '"') &&
                str_ends_with($line, '"')
            ) {
                $line = substr($line, 1, -1);
            }

            // Kembalikan tanda kutip yang di-escape
            $line = str_replace('""', '"', $line);

            // Parsing CSV
            $row = str_getcsv($line, ',', '"', '');

            // Perbaiki koma tanpa kutip pada nama produk.
            // Kolom pertama adalah Nama Produk.
            if (count($row) > $totalColumns) {
                $extraColumns = count($row) - $totalColumns;

                $productNameParts = array_slice(
                    $row,
                    0,
                    $extraColumns + 1
                );

                $productName = implode(',', $productNameParts);

                array_splice(
                    $row,
                    0,
                    $extraColumns + 1,
                    [$productName]
                );
            }

            // Validasi jumlah kolom
            if (count($headers) !== count($row)) {
                $failed++;

                $this->newLine();
                $this->error(
                    "Baris {$rowNumber}: Jumlah kolom tidak cocok."
                );

                $this->line('Header: ' . count($headers));
                $this->line('Data  : ' . count($row));
                $this->line('Isi   : ' . substr($line, 0, 300));

                continue;
            }

            // Gabungkan header dan data
            $data = array_combine($headers, $row);

            $productName = trim($data['Nama Produk'] ?? '');
            $step = 'Memulai transaksi';

            $this->newLine();
            $this->info("Memproses baris {$rowNumber}: {$productName}");

            try {
                $result = DB::transaction(function () use (
                    $data,
                    &$step,
                    $categoryName,
                    &$categoryId,
                    &$categoryChecked
                ) {
                    // =====================================
                    // DATA PRODUK
                    // =====================================

                    $step = 'Membaca data CSV';

                    $name = trim($data['Nama Produk'] ?? '');
                    $linkImage = trim($data['Image 1'] ?? '');
                    $link = trim($data['Link Produk'] ?? '');
                    $keyword = trim($data['Hashtag'] ?? '');

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

                    if (!$categoryChecked) {
                        $step = "Mengecek kategori: {$categoryName}";

                        $category = Category::withTrashed()
                            ->whereRaw(
                                'LOWER(name) = ?',
                                [Str::lower($categoryName)]
                            )
                            ->first();

                        if ($category) {
                            // Jika kategori pernah dihapus, aktifkan kembali
                            if ($category->trashed()) {
                                $category->restore();
                            }
                        } else {
                            // Generate category code
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

                            // Buat kategori baru
                            $step = 'Insert Category';

                            $category = Category::create([
                                'code' => $categoryCode,
                                'name' => $categoryName,
                            ]);
                        }

                        $categoryId = $category->id;
                        $categoryChecked = true;
                    }

                    // =====================================
                    // HARGA DAN TANGGAL
                    // =====================================

                    $step = 'Membaca harga dan tanggal';

                    $price = (int) str_replace(
                        ['.', ','],
                        '',
                        trim($data['Harga'] ?? '0')
                    );

                    $uploadDate = trim(
                        $data['Tanggal Upload'] ?? ''
                    );

                    if ($uploadDate === '') {
                        throw new \RuntimeException(
                            'Tanggal upload kosong.'
                        );
                    }

                    $recordedAt = Carbon::createFromFormat(
                        '!j/n/Y',
                        $uploadDate
                    )->format('Y-m-d');

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
                    ]);

                    // =====================================
                    // INSERT TOPICS
                    // =====================================

                    $step = 'Insert Topics';

                    $keyword = trim($keyword);

                    if ($keyword !== '') {
                        $keyword = preg_replace('/\s+/', ',', $keyword);

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

                        // Identifikasi jenis wilayah
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

                        // Cari Regency
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

                        // Simpan toko ke mst_locations
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

                if ($result) {
                    $success++;

                    // Beri peringatan jika kategori sudah ada
                    if ($categoryId !== null && !$categoryWarningShown) {
                        $category = Category::find($categoryId);

                        if ($category) {
                            // Kategori yang baru dibuat juga akan ditemukan.
                            // Peringatan ditampilkan berdasarkan status di bawah.
                        }
                    }

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
