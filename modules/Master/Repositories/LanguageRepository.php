<?php

namespace Modules\Master\Repositories;

use Modules\Master\Models\Language;

class LanguageRepository
{
    public function paginate(array $filters)
    {
        return Language::query()
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
        $language = new Language();

        $language->fill($array);
        $language->save();

        return $language;
    }

    public function getFromId($id)
    {
        return Language::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $language = Language::findOrFail($id);

        $language->fill($array);
        $language->save();

        return $language;
    }

    public function deleted($id)
    {
        $language = Language::findOrFail($id);

        return $language->delete();
    }
}
