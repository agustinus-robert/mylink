<?php

namespace Modules\Master\Controllers;

use Illuminate\Http\Request;
use Modules\Master\Models\Category;
use Modules\Master\Models\SubCategory;
use Illuminate\Routing\Controller;
use Modules\Master\Requests\SubCategoryRequests;
use Modules\Master\Services\SubCategoryService;
use Inertia\Inertia;

class SubCategoryController extends Controller
{
    public function __construct(
        protected SubCategoryService $subCategoryService
    ) {}

    private function categoryOptions()
    {
        return Category::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'dateFrom', 'dateTo', 'archived']);

        $subCategories = $this->subCategoryService->paginate($filters);

        return Inertia::render('master/scategory/index', [
            'scategories' => $subCategories,
            'categories' => $this->categoryOptions(),
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('master/scategory/form', [
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function edit(SubCategory $subCategory)
    {
        return Inertia::render('master/scategory/form', [
            'category' => $subCategory,
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function store(SubCategoryRequests $request)
    {
        $data = $request->validated();

        try {
            $this->subCategoryService->form(null, $data);

            return redirect()
                ->route('master.sub-category.index')
                ->with('success', 'Sub kategori berhasil ditambahkan.');
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function update(
        SubCategory $subCategory,
        SubCategoryRequests $request
    ) {
        $data = $request->validated();

        try {
            $this->subCategoryService->form($subCategory->id, $data);

            return redirect()
                ->route('master.sub-category.index')
                ->with('success', 'Sub kategori berhasil diperbarui.');
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }

    public function destroy(SubCategory $subCategory)
    {
        try {
            $this->subCategoryService->deletion($subCategory->id);

            return back()
                ->with('success', 'Sub kategori berhasil dihapus.');
        } catch (\Throwable $e) {
            return back()
                ->withErrors([
                    'message' => $e->getMessage(),
                ])
                ->withInput();
        }
    }
}
