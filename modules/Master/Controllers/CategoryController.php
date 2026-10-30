<?php

namespace Modules\Master\Controllers;

use Illuminate\Http\Request;
use Modules\Master\Models\SubCategory;
use Modules\Master\Models\Category;
use Illuminate\Routing\Controller;
use Modules\Master\Requests\CategoryRequests;
use Modules\Master\Services\CategoryService;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search']);

        $categories = $this->categoryService->paginate($filters);

        return Inertia::render('master/category/index', [
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $ccategories = Category::get();
        return Inertia::render('master/category/form', [
            'ccategories' => $ccategories
        ]);
    }

    public function edit(Category $category)
    {
        $ccategories = Category::get();
        return Inertia::render('master/category/form', [
            'ccategories' => $ccategories,
            'category' => $category
        ]);
    }

    public function store(CategoryRequests $request)
    {
        $data = $request->validated();
        
        try {
            $this->categoryService->form(null, $data);
        } catch (\Throwable $e) {
            dd($e->getMessage());
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function update(Category $category, CategoryRequests $request)
    {
        $data = $request->validated();

        try {
            $this->categoryService->form($category->id, $data);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(Category $category)
    {
        try {
            $this->categoryService->deletion($category->id);
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
