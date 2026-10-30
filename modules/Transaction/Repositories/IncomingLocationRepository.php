<?php

namespace Modules\Transaction\Repositories;

use Modules\Transaction\Models\ProductLocation;

class IncomingLocationRepository
{
    public function paginate(array $filters)
    {
        return ProductLocation::query()
            ->with('mst_locations:id,province,district')
            ->name($filters['name'] ?? null)
            ->range(
                $filters['dateFrom'] ?? null,
                $filters['dateTo'] ?? null
            )
            ->archived($filters['archived'] ?? null)
            ->paginate(10);
    }

    public function stored(array $array)
    {
        $item = new ProductLocation();

        $item->fill($array);
        $item->save();

        return $item;
    }

    public function getFromId($id)
    {
        return ProductLocation::findOrFail($id);
    }

    public function updated($id, array $array)
    {
        $item = ProductLocation::findOrFail($id);

        $item->fill($array);
        $item->save();

        return $item;
    }

    public function deleted($id)
    {
        $item = ProductLocation::findOrFail($id);

        return $item->delete();
    }
}
