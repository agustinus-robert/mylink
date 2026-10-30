<?php

namespace Modules\Transaction\Repositories;

use Modules\Transaction\Models\Product;

class IncomingRepository
{

    public function paginate(array $filters)
    {
        $sortColumns = [
            'date' => 'created_at',
        ];

        $sort = $filters['sort'] ?? 'date';
        $direction = $filters['direction'] ?? 'desc';

        $sortColumn = $sortColumns[$sort] ?? 'created_at';
        $direction = in_array($direction, ['asc', 'desc'], true)
            ? $direction
            : 'desc';

        return Product::query()
            ->with([
                'category:id,name',
                'subCategory:id,name',
                'detail'
            ])
            ->when(
                !empty($filters['category_id']),
                fn ($query) => $query->where(
                    'category_id',
                    $filters['category_id']
                )
            )
            ->when(
                !empty($filters['sub_category_id']),
                fn ($query) => $query->where(
                    'sub_category_id',
                    $filters['sub_category_id']
                )
            )
            ->when(
                !empty($filters['year']),
                fn ($query) => $query->whereYear(
                    'created_at',
                    $filters['year']
                )
            )
            ->when(
                !empty($filters['search']),
                function ($query) use ($filters) {
                    $search = $filters['search'];

                    $query->where(function ($query) use ($search) {
                        // $query->where(
                        //     'incoming_from',
                        //     'like',
                        //     "%{$search}%"
                        // )->
                        $query->where(
                            'subCategory',
                            fn ($subQuery) => $subQuery->where(
                                'name',
                                'like',
                                "%{$search}%"
                            )
                        );
                    });
                }
            )
            ->name($filters['name'] ?? null)
            ->range(
                $filters['dateFrom'] ?? null,
                $filters['dateTo'] ?? null
            )
            ->archived($filters['archived'] ?? null)
            ->orderBy($sortColumn, $direction)
            ->paginate(10)
            ->withQueryString();
    }


    public function stored(array $array)
    {
        $incoming = new Product();

        $incoming->fill($array);
        $incoming->save();

        return $incoming;
    }

    public function getFromId($id)
    {
        return Product::query()
            ->with([
                'items',
                'category',
                'subCategory',
                'creator',
            ])
            ->findOrFail($id);
    }

    public function updated($id, array $array)
    {
        $incoming = Product::findOrFail($id);

        $incoming->fill($array);
        $incoming->save();

        return $incoming;
    }

    public function deleted($id)
    {
        $incoming = Product::findOrFail($id);

        return $incoming->delete();
    }
}
