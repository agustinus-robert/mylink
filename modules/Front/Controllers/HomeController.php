<?php

namespace Modules\Front\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Modules\Transaction\Models\Product;
use Modules\Master\Models\Category;
use Modules\Front\Traits\ProductSimilarity;
use Modules\Transaction\Models\Topics;
use Modules\Master\Models\Province;
use Modules\Master\Models\Regency;

class HomeController extends Controller
{
    use ProductSimilarity;

    public function index(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | DEBUG RELATED SAAT HALAMAN DIBUKA
        |--------------------------------------------------------------------------
        */

        $totalProducts = Product::count();

        $totalRelatedProducts = DB::table('mst_products')
            ->whereNull('deleted_at')
            ->whereNotNull('related')
            ->whereRaw("TRIM(related) <> ''")
            ->count();

        $relatedGroups = DB::table('mst_products')
            ->selectRaw('BINARY related AS related_key, COUNT(*) AS total')
            ->whereNull('deleted_at')
            ->whereNotNull('related')
            ->whereRaw("TRIM(related) <> ''")
            ->groupByRaw('BINARY related');

        $multipleRelatedGroups = (clone $relatedGroups)
            ->havingRaw('COUNT(*) > 1');

        $singleRelatedGroups = (clone $relatedGroups)
            ->havingRaw('COUNT(*) = 1');

        $totalMultipleGroups = DB::query()
            ->fromSub(clone $multipleRelatedGroups, 'related_groups')
            ->count();

        $totalProductsInMultipleGroups = DB::query()
            ->fromSub(clone $multipleRelatedGroups, 'related_groups')
            ->sum('total');

        $totalSingleGroups = DB::query()
            ->fromSub(clone $singleRelatedGroups, 'related_groups')
            ->count();

        $totalMainProducts = $totalMultipleGroups;

        Log::info('========== RELATED PRODUCT DEBUG ==========', [
            'url' => $request->fullUrl(),
            'related_filter' => $request->boolean('related'),
            'total_active_products' => $totalProducts,
            'total_products_with_related' => $totalRelatedProducts,
            'total_related_groups_more_than_one' => $totalMultipleGroups,
            'total_products_in_multiple_groups' => $totalProductsInMultipleGroups,
            'total_main_products_expected' => $totalMainProducts,
            'total_related_groups_only_one' => $totalSingleGroups,
            'total_products_without_related' => $totalProducts - $totalRelatedProducts,
        ]);

        /*
        |--------------------------------------------------------------------------
        | FILTER
        |--------------------------------------------------------------------------
        */

        $topicsFilter = $request->input('topics', []);
        $provinceId = $request->input('province');
        $regencyId = $request->input('regency');

        $minPrice = $request->input('minPrice');
        $maxPrice = $request->input('maxPrice');

        $relatedFilter = $request->boolean('related');

        $sort = $request->input('sort', 'desc');

        if (!in_array($sort, ['asc', 'desc'], true)) {
            $sort = 'desc';
        }

        /*
        |--------------------------------------------------------------------------
        | PRODUCT QUERY
        |--------------------------------------------------------------------------
        */

        $query = Product::query()
            ->when(
                $request->searchType === 'keyword' && filled($request->keyword),
                fn ($query) => $query->where(
                    'name',
                    'like',
                    "%{$request->keyword}%"
                )
            )
            ->when(
                $request->searchType === 'category' && filled($request->category),
                fn ($query) => $query->whereIn(
                    'category_id',
                    $request->category
                )
            )

            /*
            |--------------------------------------------------------------------------
            | FILTER RELATED
            |--------------------------------------------------------------------------
            |
            | 1. Kelompokkan produk berdasarkan related.
            | 2. Ambil kelompok yang mempunyai lebih dari satu produk.
            | 3. Ambil satu produk utama menggunakan MIN(id).
            | 4. Hanya produk utama yang dimasukkan ke hasil query.
            |
            */

            ->when($relatedFilter, function ($query) {
                $query->whereIn('mst_products.id', function ($subquery) {
                    $subquery
                        ->selectRaw('MIN(id)')
                        ->from('mst_products')
                        ->whereNull('deleted_at')
                        ->whereNotNull('related')
                        ->whereRaw("TRIM(related) <> ''")
                        ->groupByRaw('BINARY related')
                        ->havingRaw('COUNT(*) > 1');
                });
            })

            // Filter provinsi.
            ->when(filled($provinceId), function ($q) use ($provinceId) {
                $q->whereHas('detail.location.district', function ($district) use ($provinceId) {
                    $district->where('province_id', $provinceId);
                });
            })

            // Filter kota/kabupaten.
            ->when(filled($regencyId), function ($q) use ($regencyId) {
                $q->whereHas('detail.location', function ($location) use ($regencyId) {
                    $location->where('district_id', $regencyId);
                });
            })

            // Filter harga.
            ->when(
                filled($minPrice) || filled($maxPrice),
                function ($q) use ($minPrice, $maxPrice) {
                    $q->whereHas('detail', function ($price) use ($minPrice, $maxPrice) {
                        $price
                            ->when(
                                filled($minPrice),
                                fn ($price) => $price->where('prices', '>=', $minPrice)
                            )
                            ->when(
                                filled($maxPrice),
                                fn ($price) => $price->where('prices', '<=', $maxPrice)
                            );
                    });
                }
            )

            // Filter topik.
            ->when(
                !empty($topicsFilter),
                fn ($query) => $query->whereHas(
                    'topics',
                    fn ($query) => $query->where(function ($query) use ($topicsFilter) {
                        foreach ($topicsFilter as $topic) {
                            $query->orWhereRaw(
                                "FIND_IN_SET(?, REPLACE(name, ', ', ','))",
                                [$topic]
                            );
                        }
                    })
                )
            )

            // Filter tanggal mulai.
            ->when(
                filled($request->dateFrom),
                fn ($query) => $query->whereDate(
                    'created_at',
                    '>=',
                    $request->dateFrom
                )
            )

            // Filter tanggal akhir.
            ->when(
                filled($request->dateTo),
                fn ($query) => $query->whereDate(
                    'created_at',
                    '<=',
                    $request->dateTo
                )
            );

        /*
        |--------------------------------------------------------------------------
        | DEBUG HASIL QUERY FILTER
        |--------------------------------------------------------------------------
        */

        $filteredProductCount = (clone $query)
            ->count('mst_products.id');

        Log::info('========== FILTERED PRODUCT DEBUG ==========', [
            'url' => $request->fullUrl(),
            'related_filter' => $relatedFilter,
            'filtered_product_count' => $filteredProductCount,
            'sql' => $query->toSql(),
            'bindings' => $query->getBindings(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | TOPICS
        |--------------------------------------------------------------------------
        */

        $topics = Topics::query()
            ->whereIn('product_id', (clone $query)->select('id'))
            ->pluck('name')
            ->flatMap(fn ($names) => explode(',', $names))
            ->map(fn ($name) => trim($name))
            ->filter()
            ->countBy()
            ->sortKeys()
            ->map(fn ($count, $name) => [
                'name' => $name,
                'count' => $count,
            ])
            ->values();

        // Categories.
        $categories = Category::query()
            ->whereNull('deleted_at')
            ->get([
                'id',
                'name',
            ]);

        // Provinces.
        $provinces = Province::query()
            ->orderBy('province')
            ->get([
                'id',
                'province as name',
            ]);

        // Regencies.
        $regencies = Regency::query()
            ->when(
                filled($provinceId),
                fn ($query) => $query->where('province_id', $provinceId)
            )
            ->orderBy('city_name')
            ->get([
                'id',
                'province_id',
                'type',
                'city_name as name',
            ]);

        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return Inertia::render('front/home/index', [
            'topics' => $topics,

            'products' => Inertia::scroll(function () use ($query, $sort, $request) {
                $paginator = (clone $query)
                    ->select([
                        'id',
                        'name',
                        'slug',
                        'link',
                        'affiliate_link',
                        'related',
                    ])
                    ->with([
                        'topics:id,product_id,name',
                        'detail' => fn ($query) => $query
                            ->select([
                                'trx_product_prices.id',
                                'trx_product_prices.product_id',
                                'trx_product_prices.prices',
                                'trx_product_prices.location_id',
                            ])
                            ->with([
                                'location:id,district_id',
                                'location.district:id,city_name,type',
                            ]),
                    ])
                    ->orderBy('name', $sort)
                    ->orderBy('id', $sort)
                    ->paginate(10)
                    ->withQueryString();

                Log::info('========== PRODUCTS PAGINATION DEBUG ==========', [
                    'url' => $request->fullUrl(),
                    'related_filter' => $request->boolean('related'),
                    'total' => $paginator->total(),
                    'count' => $paginator->count(),
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'first_product_id' => $paginator->first()?->id,
                    'product_ids' => $paginator->getCollection()->pluck('id')->toArray(),
                ]);

                return $paginator;
            }),

            'categories' => $categories,
            'provinces' => $provinces,
            'regencies' => $regencies,

            'relatedFilter' => $relatedFilter,
        ]);
    }

    /**
     * Mengambil produk identik dan produk rekomendasi.
     */
    public function relatedProducts(Request $request)
    {
        $request->validate([
            'product' => ['required', 'integer', 'exists:mst_products,id'],
        ]);

        $product = Product::query()
            ->select([
                'id',
                'name',
                'related',
            ])
            ->findOrFail($request->product);

        return response()->json(
            $this->getSimilarProducts($product)
        );
    }

    public function autocomplete(Request $request)
    {
        $keyword = trim($request->input('keyword', ''));

        if (mb_strlen($keyword) < 2) {
            return response()->json([]);
        }

        $products = Product::query()
            ->select([
                'id',
                'code',
                'name',
                'slug',
            ])
            ->where(function ($query) use ($keyword) {
                $query->where('name', 'like', "%{$keyword}%")
                    ->orWhere('code', 'like', "%{$keyword}%");
            })
            ->orderBy('name')
            ->limit(8)
            ->get();

        return response()->json($products);
    }
}
