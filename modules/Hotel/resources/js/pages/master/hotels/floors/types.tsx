import { route } from 'ziggy-js';
import { Column } from '../../../../../../../../resources/js/components/datatable/types';
import { Link, router } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';

export interface Floor {
    id: number;
    hotel_id: number;
    building_id: number;
    floor_number: number;
    name: string;
    description: string;
}

export interface Hotel {
    id: number;
    name: string;
}

export interface Building {
    id: number;
    hotel_id: number;
    name: string;
}

export interface FloorFormData {
    hotel_id: number;
    building_id: number;
    floor_number: number;
    name: string;
    description: string;
}

export interface FloorForm {
    floor?: Floor;
    hotel?: Hotel[];
    building?: Building[];
}

export interface Props {
    floor: {
        data: Floor[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export const columns: Column<Floor>[] = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'hotel_id',
        label: 'Nama Hotel',
    },
    {
        key: 'building_id',
        label: 'Nama Bangunan',
    },
    {
        key: 'id',
        label: 'Aksi',
        render: (floor: Floor) => {
            return (
                <div className="flex gap-2">
                    <Link
                        href={route('hotel.floor.edit', {
                            floor: floor.id,
                        })}
                        className="inline-flex items-center gap-1.5 font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                    >
                        <Pencil className="h-4 w-4" />
                    </Link>

                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 font-medium text-rose-400 transition-colors hover:text-rose-300"
                        onClick={() => {
                            if (
                                confirm(
                                    'Apakah anda yakin ingin menghapus data ;antai ini?',
                                )
                            ) {
                                router.delete(
                                    route('hotel.floor.destroy', {
                                        floor: floor.id,
                                    }),
                                );
                            }
                        }}
                    >
                        <Trash className="h-4 w-4" />
                    </button>
                </div>
            );
        },
    },
];
