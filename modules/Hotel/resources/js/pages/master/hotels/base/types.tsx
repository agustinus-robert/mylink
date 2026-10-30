import { Code } from 'lucide-react';
import { idText } from 'typescript';
import { Column } from '../../../../../../../../resources/js/components/datatable/types';
import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Pencil, Trash, FolderOpen, Plus } from 'lucide-react';

export interface Hotel {
    id: number;
    name: string;
    code: string;
}

export interface Province {
    id: number;
    name: string;
}

export interface Regency {
    id: number;
    province_id: number;
    name: string;
}

export interface City {
    id: number;
    regency_id: number;
    name: string;
}

export interface HotelForm {
    id: number;
    name: string;
    code: string;
    phone: number;
    email: string;
    address: string;
    city_id: number;
    regency_id: number;
    province_id: number;
    latitude: number;
    longitude: number;
}

export interface PropsForm {
    hotel?: HotelForm;
    province: Province[];
    regency: Regency[];
    city: City[];
}

export interface Props {
    hotel: {
        data: Hotel[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface HotelFormData {
    name: string;
    code: string;
    phone: number;
    email: string;
    address: string;
    city_id?: number;
    regency_id?: number;
    province_id?: number;
    latitude: number;
    longitude: number;
}

export const columns: Column<Hotel>[] = [
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
        render: (hotel: Hotel) => (
            <div className="flex gap-2">
                <Link
                    href={route('hotel.base-hotel.edit', {
                        base_hotel: hotel.id,
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
                                route('hotel.base-hotel.destroy', {
                                    base_hotel: hotel.id,
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
