import { route } from 'ziggy-js';
import { Column } from '../../../../../../../../resources/js/components/datatable/types';
import { Link, router } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';

export interface Amenities {
    id: number;
    name: string;
    slug: string;
    icon: string;
    status: number;
}

export interface Statuses {
    id: number;
    name: string;
}

export interface AmenitiesFormData {
    name: string;
    status: number;
    icon: string;
}

export interface AmenitiesForm {
    amenities?: Amenities;
    statuses?: Statuses[];
}

export interface Props {
    amenities: {
        data: Amenities[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export const columns: Column<Amenities>[] = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'slug',
        label: 'slug',
    },
    {
        key: 'name',
        label: 'Name',
    },
    {
        key: 'id',
        label: 'Aksi',
        render: (amenities: Amenities) => {
            return (
                <div className="flex gap-2">
                    <Link
                        href={route('amenities-room.amenities.edit', {
                            amenity: amenities.id,
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
                                    'Apakah anda yakin ingin menghapus data amenities ini?',
                                )
                            ) {
                                router.delete(
                                    route('amenities-room.amenities.destroy', {
                                        amenity: amenities.id,
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
