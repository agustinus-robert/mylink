import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

interface RolePermission {
    id: number;
    permission_id: number;
    role_id: number;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
}

interface Props {
    role: {
        id: number;
        name: string;
    };
    permission: Permission[];
    role_permission: RolePermission[];
}

interface FormPermission {
    permission_id: number;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
}

interface FormData {
    role_id: number;
    permissions: FormPermission[];
}

export default function RolePermissionForm({
    role,
    permission,
    role_permission,
}: Props) {
    const initialPermissions: FormPermission[] = permission.map((item) => {
        const rolePermission = role_permission.find(
            (rolePermission) => rolePermission.permission_id === item.id,
        );

        return {
            permission_id: item.id,
            can_create: rolePermission?.can_create ?? false,
            can_read: rolePermission?.can_read ?? false,
            can_update: rolePermission?.can_update ?? false,
            can_delete: rolePermission?.can_delete ?? false,
        };
    });

    const { data, setData, post, processing, errors } = useForm<FormData>({
        role_id: role.id,
        permissions: initialPermissions,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(route('account.role-permission.store'), {
            onSuccess: () => {
                toast.success('Permission berhasil disimpan.');
            },
            onError: () => {
                toast.error('Gagal menyimpan permission.');
            },
        });
    }

    function handlePermissionChange(
        permissionId: number,
        field: keyof Omit<FormPermission, 'permission_id'>,
        value: boolean,
    ) {
        setData(
            'permissions',
            data.permissions.map((item) =>
                item.permission_id === permissionId
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item,
            ),
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset disabled={processing}>
                <div className="border-b border-slate-800 px-6 py-4">
                    <h2 className="flex gap-3 text-lg font-semibold text-slate-100">
                        <ListTree />
                        Permission Role
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Atur hak akses role terhadap setiap permission.
                    </p>
                </div>

                <div className="p-6">
                    <div className="overflow-hidden rounded-md border border-slate-800">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-900">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-slate-300">
                                        Permission
                                    </th>

                                    <th className="px-4 py-3 text-center font-medium text-slate-300">
                                        Create
                                    </th>

                                    <th className="px-4 py-3 text-center font-medium text-slate-300">
                                        Read
                                    </th>

                                    <th className="px-4 py-3 text-center font-medium text-slate-300">
                                        Update
                                    </th>

                                    <th className="px-4 py-3 text-center font-medium text-slate-300">
                                        Delete
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {permission.map((item) => {
                                    const formPermission =
                                        data.permissions.find(
                                            (formPermission) =>
                                                formPermission.permission_id ===
                                                item.id,
                                        );

                                    return (
                                        <tr
                                            key={item.id}
                                            className="border-t border-slate-800"
                                        >
                                            <td className="px-4 py-3 text-slate-200">
                                                {item.name}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        formPermission?.can_create ??
                                                        false
                                                    }
                                                    onChange={(e) =>
                                                        handlePermissionChange(
                                                            item.id,
                                                            'can_create',
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        formPermission?.can_read ??
                                                        false
                                                    }
                                                    onChange={(e) =>
                                                        handlePermissionChange(
                                                            item.id,
                                                            'can_read',
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        formPermission?.can_update ??
                                                        false
                                                    }
                                                    onChange={(e) =>
                                                        handlePermissionChange(
                                                            item.id,
                                                            'can_update',
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        formPermission?.can_delete ??
                                                        false
                                                    }
                                                    onChange={(e) =>
                                                        handlePermissionChange(
                                                            item.id,
                                                            'can_delete',
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {errors.permissions && (
                        <p className="mt-2 text-sm text-red-400">
                            {errors.permissions}
                        </p>
                    )}
                </div>
            </fieldset>

            <div className="flex justify-end gap-2 border-t border-slate-800 px-6 py-4">
                <button
                    type="button"
                    disabled={processing}
                    className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Kembali
                </button>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
