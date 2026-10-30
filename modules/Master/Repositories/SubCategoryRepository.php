<?php

namespace Modules\Master\Repositories;

use Modules\Master\Models\SubCategory;

class SubCategoryRepository
{
    public function paginate(array $filters)
    {
        return SubCategory::query()
            ->with([
                'creator:id,name',
                'category:id,name',
            ])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhereHas('category', function ($categoryQuery) use ($search) {
                            $categoryQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->range(
                $filters['dateFrom'] ?? null,
                $filters['dateTo'] ?? null
            )
            ->archived($filters['archived'] ?? null)
            ->paginate(10)
            ->withQueryString();
    }

    public function stored($array)
    {
        $category = new SubCategory();

        $category->fill($array);
        $category->save();

        return $category;
    }

    public function getFromId($id)
    {
        return SubCategory::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $category = SubCategory::findOrFail($id);

        $category->fill($array);
        $category->save();

        return $category;
    }

    public function deleted($id)
    {
        $category = SubCategory::findOrFail($id);

        return $category->delete();
    }
}
