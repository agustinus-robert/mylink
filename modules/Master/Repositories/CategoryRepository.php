<?php

namespace Modules\Master\Repositories;

use Modules\Master\Models\Category;

class CategoryRepository
{
    public function paginate(array $filters)
    {
        return Category::query()
            ->with('creator:id,name')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->range(
                $filters['dateFrom'] ?? null,
                $filters['dateTo'] ?? null
            )
            ->archived($filters['archived'] ?? null)
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    public function stored($array)
    {
        $category = new Category();

        $category->fill($array);
        $category->save();

        return $category;
    }

    public function getFromId($id)
    {
        return Category::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $category = Category::findOrFail($id);

        $category->fill($array);
        $category->save();

        return $category;
    }

    public function deleted($id)
    {
        $category = Category::findOrFail($id);

        return $category->delete();
    }
}
