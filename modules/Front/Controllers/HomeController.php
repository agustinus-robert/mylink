<?php

namespace Modules\Front\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
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
        $topicsFilter = $request->input('topics', []);
        $provinceId = $request->input('province');
        $regencyId = $request->input('regency');

        $minPrice = $request->input('minPrice');
        $maxPrice = $request->input('maxPrice');

        // Filter related lebih dari satu.
        $relatedFilter = $request->boolean('related');

        // Sorting.
        $sort = $request->input('sort', 'desc');

        if (!in_array($sort, ['asc', 'desc'], true)) {
            $sort = 'desc';
        }

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

            // Filter produk dengan related lebih dari satu.
            ->when($relatedFilter, function ($query) {
                $query->whereNotNull('related')
                    ->whereRaw("TRIM(related) <> ''")
                    ->whereRaw(
                        "(LENGTH(related) - LENGTH(REPLACE(related, ',', '')) + 1) > 1"
                    );
            })

            // Filter berdasarkan provinsi.
            ->when(filled($provinceId), function ($q) use ($provinceId) {
                $q->whereHas('detail.location.district', function ($district) use ($provinceId) {
                    $district->where('province_id', $provinceId);
                });
            })

            // Filter berdasarkan kota/kabupaten.
            ->when(filled($regencyId), function ($q) use ($regencyId) {
                $q->whereHas('detail.location', function ($location) use ($regencyId) {
                    $location->where('district_id', $regencyId);
                });
            })

            // Filter berdasarkan rentang harga.
            ->when(
                filled($minPrice) || filled($maxPrice),
                function ($q) use ($minPrice, $maxPrice) {
                    $q->whereHas('detail', function ($price) use ($minPrice, $maxPrice) {
                        $price
                            ->when(
                                filled($minPrice),
                                fn ($price) => $price->where(
                                    'prices',
                                    '>=',
                                    $minPrice
                                )
                            )
                            ->when(
                                filled($maxPrice),
                                fn ($price) => $price->where(
                                    'prices',
                                    '<=',
                                    $maxPrice
                                )
                            );
                    });
                }
            )

            // Filter berdasarkan topik.
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

        // Topics.
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
            ->get(['id', 'name']);

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

        return Inertia::render('front/home/index', [
            'topics' => $topics,

            'products' => Inertia::scroll(
                fn () => (clone $query)
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
                    ->withQueryString()
            ),

            'categories' => $categories,
            'provinces' => $provinces,
            'regencies' => $regencies,

            // Status filter untuk frontend.
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
