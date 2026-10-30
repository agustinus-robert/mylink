<?php

namespace Modules\Hotel\Repositories;

use Modules\Hotel\Models\Building;

class HotelBuildingRepository
{
    public function paginate(array $filters)
    {
        return Building::query()
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
        $building = new Building();

        $building->fill($array);
        $building->save();

        return $building;
    }

    public function getFromId($id)
    {
        return Building::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $building = Building::findOrFail($id);

        $building->fill($array);
        $building->save();

        return $building;
    }

    public function deleted($id)
    {
        $building = Building::findOrFail($id);

        return $building->delete();
    }
}
