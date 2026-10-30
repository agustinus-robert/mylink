import { Column } from '../../../../../../../../resources/js/components/datatable/types';
import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Pencil, Trash } from 'lucide-react';

export interface Staff {
    id: number;
    user_id: number;
    hotel_id: number;
    start_at: string;
    end_at: string;
}

export interface Hotel {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
}

export interface PropsForm {
    staff?: Staff;
    hotel?: Hotel[];
    user?: User[];
}

export interface Props {
    staff: {
        data: Staff[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface StaffFormData {
    hotel_id: number;
    user_id: number;
    start_at: string;
    end_at: string;
}

export const columns: Column<Staff>[] = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'user_id',
        label: 'Nama Staff',
    },
    {
        key: 'hotel_id',
        label: 'Hotel',
    },
    {
        key: 'id',
        label: 'Action',
        render: (staff: Staff) => (
            <div className="flex gap-2">
                <Link
                    href={route('company.staff.edit', {
                        staff: staff.id,
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
                                route('company.staff.destroy', {
                                    staff: staff.id,
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
