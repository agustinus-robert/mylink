<?php

namespace Modules\Front\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Modules\Transaction\Models\Product;
use Modules\Master\Models\Category;
use Modules\Master\Models\SubCategory;
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
        $categoryIds = $request->input('category', []);
        $subCategoryId = $request->input('subCategory');
        $minPrice = $request->input('minPrice');
        $maxPrice = $request->input('maxPrice');
        $relatedFilter = $request->boolean('related');
        $sort = $request->input('sort', 'desc');

        if (!in_array($sort, ['asc', 'desc'], true)) {
            $sort = 'desc';
        }

        $categoryIds = is_array($categoryIds)
            ? $categoryIds
            : (filled($categoryIds) ? [$categoryIds] : []);

        $query = Product::query()
            ->keyword($request->keyword, $request->searchType)
            ->category($categoryIds, $request->searchType)
            ->subCategory($subCategoryId)
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
            ->province($provinceId)
            ->regency($regencyId)
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
            ->topics($topicsFilter)
            ->dateFrom($request->dateFrom)
            ->dateTo($request->dateTo);

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
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        $subCategories = SubCategory::query()
            ->when(
                !empty($categoryIds),
                fn ($query) => $query->whereIn(
                    'category_id',
                    $categoryIds
                )
            )
            ->orderBy('name')
            ->get([
                'id',
                'category_id',
                'name',
            ]);

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
                return $paginator;
            }),

            'categories' => $categories,
            'subCategories' => $subCategories,
            'subCategoryId' => $subCategoryId,
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
