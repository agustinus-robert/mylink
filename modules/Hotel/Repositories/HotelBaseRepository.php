<?php

namespace Modules\Hotel\Repositories;

use Modules\Hotel\Models\Hotel;

class HotelBaseRepository
{
    public function paginate(array $filters)
    {
        return Hotel::query()
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
        $category = new Hotel();

        $category->fill($array);
        $category->save();

        return $category;
    }

    public function getFromId($id)
    {
        return Hotel::where('id', $id)->get();
    }

    public function updated($id, $array)
    {
        $hotel = Hotel::findOrFail($id);

        $hotel->fill($array);
        $hotel->save();

        return $hotel;
    }

    public function deleted($id)
    {
        $hotel = Hotel::findOrFail($id);

        return $hotel->delete();
    }
}
