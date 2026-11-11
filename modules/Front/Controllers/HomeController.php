<?php

namespace Modules\Front\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Modules\Transaction\Models\Product;
use Modules\Master\Models\Category;
use Modules\Transaction\Models\Topics;
use Modules\Master\Models\Province;
use Modules\Master\Models\Regency;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $topicsFilter = $request->input('topics', []);
        $provinceId = $request->input('province');
        $regencyId = $request->input('regency');

        $minPrice = $request->input('minPrice');
        $maxPrice = $request->input('maxPrice');

        // Sorting
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
            ->when(filled($provinceId), function ($q) use ($provinceId) {
                $q->whereHas('detail.location.district', function ($district) use ($provinceId) {
                    $district->where('province_id', $provinceId);
                });
            })
            ->when(filled($regencyId), function ($q) use ($regencyId) {
                $q->whereHas('detail.location', function ($location) use ($regencyId) {
                    $location->where('district_id', $regencyId);
                });
            })
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
            ->when(
                filled($request->dateFrom),
                fn ($query) => $query->whereDate(
                    'created_at',
                    '>=',
                    $request->dateFrom
                )
            )
            ->when(
                filled($request->dateTo),
                fn ($query) => $query->whereDate(
                    'created_at',
                    '<=',
                    $request->dateTo
                )
            );

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

        $categories = Category::query()
            ->whereNull('deleted_at')
            ->get(['id', 'name']);

        $provinces = Province::query()
            ->orderBy('province')
            ->get([
                'id',
                'province as name',
            ]);

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
                        'detail' => fn ($query) => $query->select([
                            'trx_product_prices.id',
                            'trx_product_prices.product_id',
                            'trx_product_prices.prices',
                            'trx_product_prices.location_id',
                        ]),
                        'detail.location',
                    ])
                    ->orderBy('name', $sort)
                    ->orderBy('id', $sort)
                    ->paginate(10)
                    ->withQueryString()
            ),

            'categories' => $categories,
            'provinces' => $provinces,
            'regencies' => $regencies,
        ]);
    }
    
    /**
     * Mengambil produk dengan related yang sama.
     */
    public function relatedProducts(Request $request)
    {
        $request->validate([
            'product' => ['required', 'integer', 'exists:mst_products,id'],
        ]);

        $product = Product::query()
            ->select(['id', 'name', 'related'])
            ->findOrFail($request->product);

        if (!filled($product->related)) {
            return response()->json([
                'data' => [],
                'total' => 0,
            ]);
        }

        $relatedProducts = Product::query()
            ->select([
                'id',
                'name',
                'slug',
                'link',
                'affiliate_link',
                'related',
            ])
            ->where('id', '!=', $product->id)
            ->where('related', $product->related)
            ->with([
                'detail' => fn ($query) => $query->select([
                    'trx_product_prices.id',
                    'trx_product_prices.product_id',
                    'trx_product_prices.prices',
                    'trx_product_prices.location_id',
                ]),
            ])
            ->orderBy('name')
            ->limit(50)
            ->get();

        return response()->json([
            'data' => $relatedProducts,
            'total' => $relatedProducts->count(),
        ]);
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
