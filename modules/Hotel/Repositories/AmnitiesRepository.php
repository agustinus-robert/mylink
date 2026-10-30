<?php

namespace Modules\Hotel\Repositories;

use Modules\Hotel\Models\Amnities;

class AmnitiesRepository
{
    public function paginate(array $filters)
    {
        return Amnities::query()
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
        $amnities = new Amnities();

        $amnities->fill($array);
        $amnities->save();

        return $amnities;
    }

    public function getFromId($id)
    {
        return Amnities::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $amnities = Amnities::findOrFail($id);

        $amnities->fill($array);
        $amnities->save();

        return $amnities;
    }

    public function deleted($id)
    {
        $amnities = Amnities::findOrFail($id);

        return $amnities->delete();
    }
}
