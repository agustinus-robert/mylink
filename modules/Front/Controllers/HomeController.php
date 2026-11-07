<?php

namespace Modules\Front\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Modules\Transaction\Models\Product;
use Modules\Master\Models\Category;
use Modules\Transaction\Models\Topics;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $topicsFilter = $request->input('topics', []);

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

        return Inertia::render('front/home/index', [
            'topics' => $topics,
            'products' => Inertia::scroll(
                fn () => (clone $query)
                    ->with([
                        'topics:id,product_id,name',
                        'detail' => fn ($query) => $query->select([
                            'trx_product_prices.id',
                            'trx_product_prices.product_id',
                            'trx_product_prices.prices',
                        ]),
                    ])
                    ->latest()
                    ->paginate(10)
                    ->withQueryString()
            ),
            'categories' => $categories,
        ]);
    }
}
