import { Code } from 'lucide-react';
import { idText } from 'typescript';
import { Column } from '../../../../../../../../resources/js/components/datatable/types';
import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Pencil, Trash, FolderOpen, Plus } from 'lucide-react';
import BuildingFormData from './form';

export interface Building {
    id: number;
    name: string;
    code: string;
    hotel_id: number;
    description: string;
}

export interface Hotel {
    id: number;
    name: string;
}

export interface BuildingForm {
    building?: Building;
    hotel?: Hotel[];
}

export interface BuildingFormData {
    code: string;
    hotel_id: number;
    name: string;
    description: string;
}

export interface Props {
    building: {
        data: Building[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export const columns: Column<Building>[] = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'name',
        label: 'name',
    },
    {
        key: 'code',
        label: 'Code',
    },
    {
        key: 'id',
        label: 'Action',
        render: (building: Building) => (
            <div className="flex gap-2">
                <Link
                    href={route('hotel.building.edit', {
                        building: building.id,
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
                                'Apakah anda yakin ingin menghapus data hotel ini?',
                            )
                        ) {
                            router.delete(
                                route('hotel.building.destroy', {
                                    building: building.id,
                                }),
                            );
                        }
                    }}
                >
                    <Trash className="h-4 w-4" />
                </button>
            </div>
        ),
    },
];
