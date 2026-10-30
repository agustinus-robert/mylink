import { Column } from '../../../../../../../../resources/js/components/datatable/types';
import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Pencil, Trash } from 'lucide-react';

export interface Department {
    id: number;
    hotel_id: number;
    name: string;
    slug: string;
}

export interface Hotel {
    id: number;
    name: string;
}

export interface PropsForm {
    department?: Department;
    hotel?: Hotel[];
}

export interface Props {
    department: {
        data: Department[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface DepartmentFormData {
    hotel_id: number;
    name: string;
}

export const columns: Column<Department>[] = [
    {
        key: 'id',
        label: 'ID',
    },
    {
        key: 'name',
        label: 'name',
    },
    {
        key: 'slug',
        label: 'Slug',
    },
    {
        key: 'id',
        label: 'Action',
        render: (department: Department) => (
            <div className="flex gap-2">
                <Link
                    href={route('company.department.edit', {
                        department: department.id,
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
                                route('company.department.destroy', {
                                    department: department.id,
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
