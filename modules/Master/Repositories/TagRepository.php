<?php

namespace Modules\Master\Repositories;

use Modules\Master\Models\Tag;

class TagRepository
{
    public function paginate(array $filters)
    {
        return Tag::query()
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
        $tag = new Tag();

        $tag->fill($array);
        $tag->save();

        return $tag;
    }

    public function getFromId($id)
    {
        return Tag::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $tag = Tag::findOrFail($id);

        $tag->fill($array);
        $tag->save();

        return $tag;
    }

    public function deleted($id)
    {
        $tag = Tag::findOrFail($id);

        return $tag->delete();
    }
}
