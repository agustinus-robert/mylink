<?php

namespace Modules\Hotel\Repositories;

use Modules\Hotel\Models\Floor;

class HotelFloorRepository
{
    public function paginate(array $filters)
    {
        return Floor::query()
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
        $floor = new Floor();

        $floor->fill($array);
        $floor->save();

        return $floor;
    }

    public function getFromId($id)
    {
        return Floor::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $floor = Floor::findOrFail($id);

        $floor->fill($array);
        $floor->save();

        return $floor;
    }

    public function deleted($id)
    {
        $floor = Floor::findOrFail($id);

        return $floor->delete();
    }
}
