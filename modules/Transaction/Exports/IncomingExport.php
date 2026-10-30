<?php

namespace Modules\Transaction\Exports;

use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Modules\Transaction\Models\Incoming;

class IncomingExport implements FromQuery, WithHeadings, WithMapping
{
    public function __construct(
        protected array $filters = []
    ) {}

    public function query(): Builder
    {
        return Incoming::query()
            ->with([
                'creator:id,name',
                'category:id,name',
                'subCategory:id,name',
            ])
            ->when(
                $this->filters['category_id'] ?? null,
                fn (Builder $query, $value) => $query->where('category_id', $value)
            )
            ->when(
                $this->filters['sub_category_id'] ?? null,
                fn (Builder $query, $value) => $query->where('sub_category_id', $value)
            )
            ->when(
                $this->filters['year'] ?? null,
                fn (Builder $query, $value) => $query->whereYear('created_at', $value)
            )
            ->when(
                $this->filters['dateFrom'] ?? null,
                fn (Builder $query, $value) => $query->whereDate('created_at', '>=', $value)
            )
            ->when(
                $this->filters['dateTo'] ?? null,
                fn (Builder $query, $value) => $query->whereDate('created_at', '<=', $value)
            )
            ->when(
                $this->filters['search'] ?? null,
                function (Builder $query, $value) {
                    $query->where(function (Builder $query) use ($value) {
                        $query->where('incoming_from', 'ilike', "%{$value}%")
                            ->orWhereHas('subCategory', function (Builder $subQuery) use ($value) {
                                $subQuery->where('name', 'ilike', "%{$value}%");
                            });
                    });
                }
            )
            ->when(
                $this->filters['archived'] ?? null,
                fn (Builder $query, $value) => $query->where('archived', $value)
            )
            ->when(
                $this->filters['sort'] ?? null,
                function (Builder $query, $column) {
                    $allowedColumns = [
                        'created_at',
                        'incoming_from',
                        'grand_total',
                    ];

                    if (in_array($column, $allowedColumns, true)) {
                        $direction = strtolower(
                            $this->filters['direction'] ?? 'desc'
                        );

                        $direction = in_array($direction, ['asc', 'desc'], true)
                            ? $direction
                            : 'desc';

                        $query->orderBy($column, $direction);
                    }
                },
                fn (Builder $query) => $query->latest('created_at')
            );
    }

    public function headings(): array
    {
        return [
            'ID',
            'Tanggal',
            'Asal Barang',
            'Kategori',
            'Subkategori',
            'Total',
            'Operator ID',
            'Dibuat Oleh',
        ];
    }

    public function map($incoming): array
    {
        return [
            $incoming->id,
            $incoming->created_at?->format('d-m-Y H:i'),
            $incoming->incoming_from,
            $incoming->category?->name,
            $incoming->subCategory?->name,
            $incoming->grand_total,
            $incoming->operator_id,
            $incoming->creator?->name,
        ];
    }
}