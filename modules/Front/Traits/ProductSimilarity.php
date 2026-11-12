<?php

namespace Modules\Front\Traits;

use Modules\Transaction\Models\Product;

trait ProductSimilarity
{
    /**
     * Kamus jenis produk.
     */
    private array $productDictionary = [
        'laptop' => [
            'laptop',
            'notebook',
            'ultrabook',
            'netbook',
            'macbook',
            'thinkpad',
            'ideapad',
            'vivobook',
            'zenbook',
            'matebook',
        ],

        'ram' => [
            'ram',
            'memory',
            'memori',
            'ddr3',
            'ddr3l',
            'ddr4',
            'ddr5',
            'sodimm',
            'udimm',
        ],

        'mouse' => [
            'mouse',
            'tetikus',
        ],

        'keyboard' => [
            'keyboard',
            'key board',
            'papan ketik',
        ],
    ];

    /**
     * Kamus merek dan alias produk.
     *
     * Nama seri dapat digunakan untuk mengenali merek induk.
     */
    private array $brandDictionary = [
        'apple' => [
            'apple',
            'macbook',
            'imac',
            'mac mini',
            'mac studio',
        ],

        'lenovo' => [
            'lenovo',
            'thinkpad',
            'ideapad',
            'legion',
            'thinkbook',
            'yoga',
        ],

        'asus' => [
            'asus',
            'vivobook',
            'zenbook',
            'rog',
            'tuf gaming',
            'proart',
            'expertbook',
        ],

        'acer' => [
            'acer',
            'aspire',
            'swift',
            'nitro',
            'predator',
            'travelmate',
        ],

        'hp' => [
            'hp',
            'hewlett packard',
            'pavilion',
            'elitebook',
            'probook',
            'omen',
            'victus',
        ],

        'dell' => [
            'dell',
            'inspiron',
            'latitude',
            'vostro',
            'xps',
            'alienware',
        ],

        'msi' => [
            'msi',
            'modern',
            'prestige',
            'katana',
            'cyborg',
            'raider',
        ],

        'zyrex' => [
            'zyrex',
        ],

        'axioo' => [
            'axioo',
        ],

        'advan' => [
            'advan',
        ],

        'gigabyte' => [
            'gigabyte',
            'aorus',
        ],

        'samsung' => [
            'samsung',
            'galaxy',
        ],

        'xiaomi' => [
            'xiaomi',
            'redmi',
            'poco',
        ],

        'huawei' => [
            'huawei',
            'matebook',
        ],

        'logitech' => [
            'logitech',
        ],

        'razer' => [
            'razer',
        ],

        'rexus' => [
            'rexus',
        ],

        'fantech' => [
            'fantech',
        ],

        'steelseries' => [
            'steelseries',
        ],

        'corsair' => [
            'corsair',
        ],

        'hyperx' => [
            'hyperx',
        ],

        'kingston' => [
            'kingston',
        ],

        'crucial' => [
            'crucial',
        ],

        'v-gen' => [
            'v-gen',
            'vgen',
        ],

        'teamgroup' => [
            'teamgroup',
            'team group',
        ],

        'sandisk' => [
            'sandisk',
        ],

        'wd' => [
            'western digital',
            'wd',
        ],

        'seagate' => [
            'seagate',
        ],

        'ugreen' => [
            'ugreen',
        ],

        'baseus' => [
            'baseus',
        ],

        'robot' => [
            'robot',
        ],

        'prolink' => [
            'prolink',
        ],

        'jbl' => [
            'jbl',
        ],

        'sony' => [
            'sony',
        ],

        'jabra' => [
            'jabra',
        ],

        'kaizen' => [
            'kaizen',
        ],

        'rx7' => [
            'rx7',
        ],
    ];

    /**
     * Kata yang tidak terlalu berguna untuk identifikasi.
     */
    private array $stopWords = [
        'dan',
        'dengan',
        'untuk',
        'dari',
        'the',
        'with',
        'for',
        'new',
        'original',
        'ori',
        'termurah',
        'murah',
        'promo',
        'diskon',
        'ready',
        'stock',
        'stok',
        'official',
        'store',
        'garansi',
        'resmi',
        'free',
        'bonus',
        'jual',
        'laptop',
        'notebook',
        'mouse',
        'keyboard',
        'ram',
        'memory',
        'memori',
        'pc',
        'komputer',
    ];

    /**
     * Mengambil produk identik dan rekomendasi.
     */
        
    private function getSimilarProducts(Product $product): array
    {
        $mainName = $product->name;

        $mainTokens = $this->tokenizeProductName($mainName);

        $mainCategory = $this->detectProductType($mainName);

        $mainBrand = $this->detectProductBrand($mainName);

        /*
        * ==========================================
        * PRODUK IDENTIK
        * ==========================================
        *
        * Identik ditentukan langsung berdasarkan
        * nilai related yang sama.
        *
        * Tidak bergantung pada merek, kategori,
        * token, maupun cosine similarity.
        */

        $identicalQuery = Product::query()
            ->select([
                'id',
                'name',
                'slug',
                'link',
                'affiliate_link',
                'related',
            ])
            ->where('id', '!=', $product->id)
            ->whereNotNull('related')
            ->whereRaw("TRIM(related) <> ''")
            ->whereRaw('BINARY related = BINARY ?', [
                $product->related,
            ])
            ->with([
                'detail' => fn ($query) => $query->select([
                    'trx_product_prices.id',
                    'trx_product_prices.product_id',
                    'trx_product_prices.prices',
                    'trx_product_prices.location_id',
                ])->with([
                    'location:id,district_id',
                    'location.district:id,city_name,type',
                ]),
            ])
            ->orderBy('id');

        $identicalTotal = (clone $identicalQuery)->count();

        $identical = (clone $identicalQuery)
            ->limit(50)
            ->get()
            ->map(function ($item) {
                $data = $item->toArray();

                $data['similarity'] = 100;

                return $data;
            })
            ->values();

        /*
        * Hasil awal.
        *
        * Produk identik tetap ditampilkan meskipun
        * merek atau kategori tidak dikenali.
        */
        $emptyResult = [
            'identical' => [
                'data' => $identical,
                'total' => $identicalTotal,
            ],
            'recommended' => [
                'data' => [],
                'total' => 0,
            ],
        ];

        /*
        * ==========================================
        * REKOMENDASI PRODUK
        * ==========================================
        *
        * Bagian ini tetap menggunakan algoritma
        * similarity yang sudah ada.
        */

        if (
            empty($mainTokens) ||
            $mainCategory === null ||
            $mainBrand === null
        ) {
            return $emptyResult;
        }

        $searchTokens = collect($mainTokens)
            ->filter(fn ($token) => mb_strlen($token) >= 3)
            ->take(8)
            ->values();

        $candidates = Product::query()
            ->select([
                'id',
                'name',
                'slug',
                'link',
                'affiliate_link',
                'related',
            ])
            ->where('id', '!=', $product->id)
            ->where(function ($query) use ($product, $searchTokens) {
                if (filled($product->related)) {
                    $query->orWhere(
                        'related',
                        $product->related
                    );
                }

                foreach ($searchTokens as $token) {
                    $query->orWhere(
                        'name',
                        'like',
                        '%' . $token . '%'
                    );
                }
            })
            ->with([
                'detail' => fn ($query) => $query->select([
                    'trx_product_prices.id',
                    'trx_product_prices.product_id',
                    'trx_product_prices.prices',
                    'trx_product_prices.location_id',
                ])->with([
                    'location:id,district_id',
                    'location.district:id,city_name,type',
                ]),
            ])
            ->limit(300)
            ->get();

        if ($candidates->isEmpty()) {
            return $emptyResult;
        }

        /*
        * Corpus untuk perhitungan IDF.
        */
        $documents = collect([$mainName])
            ->merge($candidates->pluck('name'))
            ->map(
                fn ($name) => $this->tokenizeProductName($name)
            );

        $documentCount = $documents->count();

        $documentFrequency = [];

        foreach ($documents as $tokens) {
            foreach (array_unique($tokens) as $token) {
                $documentFrequency[$token] =
                    ($documentFrequency[$token] ?? 0) + 1;
            }
        }

        $mainVector = $this->buildTfIdfVector(
            $mainTokens,
            $documentFrequency,
            $documentCount
        );

        $recommended = [];

        foreach ($candidates as $candidate) {
            $candidateName = $candidate->name;

            $candidateTokens = $this->tokenizeProductName(
                $candidateName
            );

            $candidateCategory = $this->detectProductType(
                $candidateName
            );

            $candidateBrand = $this->detectProductBrand(
                $candidateName
            );

            /*
            * Wajib sama merek.
            */
            if ($candidateBrand !== $mainBrand) {
                continue;
            }

            /*
            * Wajib sama jenis barang.
            */
            if ($candidateCategory !== $mainCategory) {
                continue;
            }

            $candidateVector = $this->buildTfIdfVector(
                $candidateTokens,
                $documentFrequency,
                $documentCount
            );

            $similarity = $this->cosineSimilarity(
                $mainVector,
                $candidateVector
            );

            $conflicts = $this->hasSpecificationConflict(
                $mainName,
                $candidateName,
                $mainCategory
            );

            $sharedTokens = array_intersect(
                $mainTokens,
                $candidateTokens
            );

            $hasSharedAttribute = $this->hasSharedAttribute(
                $mainName,
                $candidateName,
                $mainCategory
            );

            /*
            * Produk identik sudah diambil dari related.
            * Di sini hanya menghitung rekomendasi.
            */
            if (
                $similarity >= 0.18 &&
                !$conflicts
            ) {
                $recommended[] = [
                    'product' => $candidate,
                    'similarity' => $similarity,
                ];
            }
        }

        /*
        * Urutkan rekomendasi berdasarkan similarity.
        */
        $recommended = collect($recommended)
            ->sortByDesc('similarity')
            ->take(50)
            ->values();

        return [
            'identical' => [
                'data' => $identical,
                'total' => $identicalTotal,
            ],

            'recommended' => [
                'data' => $recommended
                    ->map(
                        fn ($item) => $this->formatSimilarProduct($item)
                    )
                    ->values(),

                'total' => $recommended->count(),
            ],
        ];
    }


    /**
     * Normalisasi dan tokenisasi nama produk.
     */
    private function tokenizeProductName(string $name): array
    {
        $name = mb_strtolower($name);

        $name = str_replace(
            ['×', '–', '—', '_', '/', '\\'],
            ' ',
            $name
        );

        $name = preg_replace(
            '/[^\pL\pN.]+/u',
            ' ',
            $name
        );

        $tokens = preg_split(
            '/\s+/u',
            trim($name)
        );

        return collect($tokens)
            ->filter()
            ->map(fn ($token) => trim($token, '.'))
            ->filter(function ($token) {
                return mb_strlen($token) >= 2
                    && !in_array(
                        $token,
                        $this->stopWords,
                        true
                    );
            })
            ->unique()
            ->values()
            ->all();
    }

    /**
     * Mendeteksi jenis produk.
     */
    private function detectProductType(string $name): ?string
    {
        $name = mb_strtolower($name);

        /*
         * Prioritaskan kata laptop.
         * Contoh: Laptop DDR4 8GB tetap laptop,
         * bukan RAM.
         */
        foreach ($this->productDictionary as $type => $keywords) {
            foreach ($keywords as $keyword) {
                $pattern = '/(?<![\pL\pN])'
                    . preg_quote($keyword, '/')
                    . '(?![\pL\pN])/iu';

                if (preg_match($pattern, $name)) {
                    return $type;
                }
            }
        }

        return null;
    }

    /**
     * Mendeteksi merek berdasarkan nama dan alias.
     */
    private function detectProductBrand(string $name): ?string
    {
        $name = mb_strtolower($name);

        $matchedBrands = [];

        foreach ($this->brandDictionary as $brand => $aliases) {
            foreach ($aliases as $alias) {
                $pattern = '/(?<![\pL\pN])'
                    . preg_quote(mb_strtolower($alias), '/')
                    . '(?![\pL\pN])/iu';

                if (preg_match($pattern, $name)) {
                    $matchedBrands[$brand] = max(
                        $matchedBrands[$brand] ?? 0,
                        mb_strlen($alias)
                    );
                }
            }
        }

        if (empty($matchedBrands)) {
            return null;
        }

        /*
         * Jika beberapa alias ditemukan,
         * prioritaskan alias terpanjang.
         */
        arsort($matchedBrands);

        return array_key_first($matchedBrands);
    }

    /**
     * Menghitung TF-IDF vector.
     */
    private function buildTfIdfVector(
        array $tokens,
        array $documentFrequency,
        int $documentCount
    ): array {
        $vector = [];

        $totalTokens = max(count($tokens), 1);

        $termFrequency = array_count_values($tokens);

        foreach ($termFrequency as $token => $frequency) {
            $tf = $frequency / $totalTokens;

            $df = $documentFrequency[$token] ?? 0;

            $idf = log(
                1 + ($documentCount / (1 + $df))
            );

            $vector[$token] = $tf * $idf;
        }

        return $vector;
    }

    /**
     * Cosine Similarity.
     */
    private function cosineSimilarity(
        array $vectorA,
        array $vectorB
    ): float {
        if (empty($vectorA) || empty($vectorB)) {
            return 0;
        }

        $dotProduct = 0;

        $magnitudeA = 0;

        $magnitudeB = 0;

        foreach ($vectorA as $token => $weight) {
            $dotProduct += $weight * ($vectorB[$token] ?? 0);

            $magnitudeA += $weight ** 2;
        }

        foreach ($vectorB as $weight) {
            $magnitudeB += $weight ** 2;
        }

        if ($magnitudeA == 0 || $magnitudeB == 0) {
            return 0;
        }

        return $dotProduct / (
            sqrt($magnitudeA) * sqrt($magnitudeB)
        );
    }

    /**
     * Mengambil atribut spesifikasi dari nama produk.
     */
    private function extractSpecifications(
        string $name,
        ?string $category
    ): array {
        $name = mb_strtolower($name);

        $specifications = [];

        /*
         * RAM.
         */
        if (preg_match(
            '/(?:ram|memory|memori)[^\d]{0,15}(\d+)\s*gb|(\d+)\s*gb\s*(?:ram|memory|memori)/i',
            $name,
            $matches
        )) {
            $specifications['ram'] =
                ($matches[1] ?: $matches[2]) . 'gb';
        } elseif (
            $category === 'ram' &&
            preg_match(
                '/\b(4|8|12|16|24|32|48|64|128)\s*gb\b/i',
                $name,
                $matches
            )
        ) {
            $specifications['ram'] = preg_replace(
                '/\s+/',
                '',
                $matches[0]
            );
        }

        /*
         * Generasi RAM.
         */
        if (preg_match(
            '/\bddr\s*([345])l?\b/i',
            $name,
            $matches
        )) {
            $specifications['ddr'] = 'ddr' . $matches[1];
        }

        /*
         * Storage.
         */
        if (preg_match(
            '/\b(128|256|512|1024|2048|1|2)\s*(gb|tb)\s*(?:ssd|nvme|hdd)\b/i',
            $name,
            $matches
        )) {
            $specifications['storage'] = $this->normalizeStorage(
                $matches[1],
                $matches[2]
            );
        } elseif (preg_match(
            '/\b(?:ssd|nvme|hdd)[^\d]{0,10}(128|256|512|1024|2048|1|2)\s*(gb|tb)\b/i',
            $name,
            $matches
        )) {
            $specifications['storage'] = $this->normalizeStorage(
                $matches[1],
                $matches[2]
            );
        }

        /*
         * Ukuran layar laptop.
         */
        if (preg_match(
            '/\b(11\.6|12\.5|13\.3|13\.4|14|15\.6|16|17\.3)\s*(?:inch|inci|")\b/i',
            $name,
            $matches
        )) {
            $specifications['screen'] = $matches[1] . 'inch';
        }

        /*
         * Kecepatan RAM.
         */
        if (preg_match(
            '/\b(2400|2666|2933|3000|3200|3600|4800|5200|5600|6000|6400)\s*mhz\b/i',
            $name,
            $matches
        )) {
            $specifications['frequency'] = $matches[1] . 'mhz';
        }

        /*
         * DPI mouse.
         */
        if (preg_match(
            '/\b(800|1000|1200|1600|2400|3200|4000|7200|12000|16000)\s*dpi\b/i',
            $name,
            $matches
        )) {
            $specifications['dpi'] = $matches[1] . 'dpi';
        }

        /*
         * Prosesor laptop AMD Ryzen.
         */
        if (
            $category === 'laptop' &&
            preg_match(
                '/\b(ryzen\s*[3579]\s*\d{4}[a-z]{0,2})\b/i',
                $name,
                $matches
            )
        ) {
            $specifications['processor'] = preg_replace(
                '/\s+/',
                '',
                $matches[1]
            );
        } elseif (
            $category === 'laptop' &&
            preg_match(
                '/\b(i[3579])[- ]?(\d{4,5}[a-z]{0,2})\b/i',
                $name,
                $matches
            )
        ) {
            $specifications['processor'] =
                $matches[1] . $matches[2];
        }

        /*
         * Model mouse.
         */
        if (
            $category === 'mouse' &&
            preg_match(
                '/\b(g\d{2,4}|gm\d{2,4}|m\d{2,4})\b/i',
                $name,
                $matches
            )
        ) {
            $specifications['model'] = mb_strtolower(
                $matches[1]
            );
        }

        /*
         * Ukuran keyboard.
         */
        if (
            $category === 'keyboard' &&
            preg_match(
                '/\b(60|65|68|75|80|87|96|98|100)\s*%?\b/i',
                $name,
                $matches
            )
        ) {
            $specifications['layout_size'] = $matches[1];
        }

        /*
         * Switch keyboard.
         */
        if ($category === 'keyboard') {
            foreach (['red', 'blue', 'brown'] as $switch) {
                if (preg_match(
                    '/\b' . $switch . '\s*switch\b/i',
                    $name
                )) {
                    $specifications['switch'] = $switch;
                    break;
                }
            }
        }

        return $specifications;
    }

    /**
     * Normalisasi storage ke satuan GB.
     */
    private function normalizeStorage(
        string $value,
        string $unit
    ): string {
        $value = (float) $value;

        if (mb_strtolower($unit) === 'tb') {
            $value *= 1024;
        }

        return (string) (int) $value . 'gb';
    }

    /**
     * Memeriksa konflik spesifikasi.
     */
    private function hasSpecificationConflict(
        string $nameA,
        string $nameB,
        ?string $category
    ): bool {
        $specA = $this->extractSpecifications(
            $nameA,
            $category
        );

        $specB = $this->extractSpecifications(
            $nameB,
            $category
        );

        foreach ($specA as $attribute => $valueA) {
            if (!array_key_exists($attribute, $specB)) {
                continue;
            }

            if ($valueA !== $specB[$attribute]) {
                return true;
            }
        }

        return false;
    }

    /**
     * Memastikan ada atribut penting yang sama.
     */
    private function hasSharedAttribute(
        string $nameA,
        string $nameB,
        ?string $category
    ): bool {
        if ($category === null) {
            return false;
        }

        $specA = $this->extractSpecifications(
            $nameA,
            $category
        );

        $specB = $this->extractSpecifications(
            $nameB,
            $category
        );

        foreach ($specA as $attribute => $valueA) {
            if (
                isset($specB[$attribute]) &&
                $specB[$attribute] === $valueA
            ) {
                return true;
            }
        }

        /*
         * Jika tidak ada spesifikasi terstruktur,
         * gunakan kecocokan token nama.
         */
        $tokensA = $this->tokenizeProductName($nameA);

        $tokensB = $this->tokenizeProductName($nameB);

        return count(
            array_intersect($tokensA, $tokensB)
        ) >= 3;
    }

    /**
     * Format data produk beserta nilai similarity.
     */
    private function formatSimilarProduct(array $item): array
    {
        $product = $item['product']->toArray();

        $product['similarity'] = round(
            $item['similarity'] * 100,
            2
        );

        return $product;
    }
}
