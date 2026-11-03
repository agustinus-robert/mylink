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
        $query = Product::query()
            ->when(
                $request->searchType === 'keyword',
                fn ($query) => $query->where(
                    'name',
                    'like',
                    "%{$request->keyword}%"
                )
            )
            ->when(
                $request->searchType === 'category',
                fn ($query) => $query->whereIn(
                    'category_id',
                    $request->category ?? []
                )
            )
            ->when(
                $request->dateFrom,
                fn ($query) => $query->whereDate(
                    'created_at',
                    '>=',
                    $request->dateFrom
                )
            )
            ->when(
                $request->dateTo,
                fn ($query) => $query->whereDate(
                    'created_at',
                    '<=',
                    $request->dateTo
                )
            );

        $products = (clone $query)
            ->with('topics:id,product_id,name')
            ->latest()
            ->get(['id', 'name']);

        $topics = Topics::query()
            ->whereIn('product_id', $products->pluck('id'))
            ->select('name')
            ->distinct()
            ->orderBy('name')
            ->get();

        $categories = Category::whereNull('deleted_at')
            ->get(['id', 'name']);

        return Inertia::render('front/home/index', [
            'topics' => $topics,
            'products' => $products,
            'categories' => $categories,
        ]);
    }
}
