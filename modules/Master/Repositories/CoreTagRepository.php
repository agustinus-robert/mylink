<?php

namespace Modules\Master\Repositories;

use Modules\Master\Models\CoreTag;

class CoreTagRepository
{
    public function paginate(array $filters)
    {
        return CoreTag::query()
            ->with('creator:id,name')
            ->name($filters['name'] ?? null)
            ->range(
                $filters['dateFrom'] ?? null,
                $filters['dateTo'] ?? null
            )
            ->archived($filters['archived'] ?? null)
            ->paginate(10);
    }

    public function stored($array)
    {
        $category = new CoreTag();

        $category->fill($array);
        $category->save();

        return $category;
    }

    public function getFromId($id)
    {
        return CoreTag::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $category = CoreTag::findOrFail($id);

        $category->fill($array);
        $category->save();

        return $category;
    }

    public function deleted($id)
    {
        $category = CoreTag::findOrFail($id);

        return $category->delete();
    }
}
