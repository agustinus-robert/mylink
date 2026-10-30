<?php

namespace Modules\Transaction\Repositories;

use Modules\Transaction\Models\ProductPrice;

class IncomingPriceRepository
{
    public function paginate(array $filters)
    {
        return ProductPrice::query()
            ->with('trx_product_prices:id,price')
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
        $item = new ProductPrice();

        $item->fill($array);
        $item->save();

        return $item;
    }

    public function getFromId($id)
    {
        return ProductPrice::findOrFail($id);
    }

    public function updated($id, array $array)
    {
        $item = ProductPrice::findOrFail($id);

        $item->fill($array);
        $item->save();

        return $item;
    }

    public function deleted($id)
    {
        $item = ProductPrice::findOrFail($id);

        return $item->delete();
    }

    public function deleteByIncomingId($incomingId)
    {
        return ProductPrice::where('incoming_id', $incomingId)
            ->delete();
    }
}
