import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useEffect, useState } from 'react';
import AppModal from '../../../../../../resources/js/components/app-modal';
import UserForm from './form';
import {
    Pencil,
    Trash,
    FolderOpen,
    Plus,
    Users,
    Lock,
    LockOpen,
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    lock: boolean | number;
    roles: {
        id: number;
        name: string;
    }[];
    creator: {
        id: number;
        name: string;
    } | null;
}

interface RoleOption {
    id: number;
    name: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    user: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    roles: RoleOption[];
    filters: {
        role_id?: string | number | null;
    };
}

export default function Role({ user, roles, filters }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(
        undefined,
    );
    const [roleId, setRoleId] = useState(String(filters.role_id ?? ''));

    useEffect(() => {
        const currentRoleId = String(filters.role_id ?? '');

        if (roleId === currentRoleId) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('account.user.index'),
                {
                    role_id: roleId || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 200);

        return () => clearTimeout(timeout);
    }, [roleId, filters.role_id]);

    function isLocked(item: User): boolean {
        return Boolean(item.lock);
    }

    function isAdmin(item: User): boolean {
        return (
            item.roles?.some((role) => role.name.toLowerCase() === 'admin') ??
            false
        );
    }

    function handleCreate() {
        setSelectedUser(undefined);
        setModalOpen(true);
    }

    function handleEdit(item: User) {
        setSelectedUser(item);
        setModalOpen(true);
    }

    function handleCloseModal() {
        setModalOpen(false);
        setSelectedUser(undefined);
    }

    function handleToggleLock(item: User) {
        if (isAdmin(item)) {
            return;
        }

        const locked = isLocked(item);
        const action = locked ? 'membuka kunci' : 'mengunci';

        if (
            !confirm(`Apakah Anda yakin ingin ${action} pengguna ${item.name}?`)
        ) {
            return;
        }

        router.patch(
            route('account.user.locked', { user: item.id }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        locked
                            ? 'Pengguna berhasil dibuka.'
                            : 'Pengguna berhasil dikunci.',
                    );
                },
                onError: () => {
                    toast.error('Gagal mengubah status pengguna.');
                },
            },
        );
    }

    function handleDelete(id: number) {
        if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            return;
        }

        router.delete(route('account.user.destroy', { role: id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pengguna berhasil dihapus.');
            },
            onError: () => {
                toast.error('Pengguna gagal dihapus.');
            },
        });
    }

    return (
        <>
            <Head title="Pengguna" />

            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-background shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 bg-background px-6 py-4">
                        <h2 className="text-lg font-semibold text-slate-100">
                            Daftar Pengguna
                        </h2>

                        <button
                            type="button"
                            onClick={handleCreate}
                            className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah
                        </button>
                    </div>

                    <div className="border-b border-slate-800 px-6 py-4">
                        <div className="w-full sm:max-w-xs">
                            <label
                                htmlFor="role-filter"
                                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
                            >
                                <Users className="h-4 w-4" />
                                Filter Role
                            </label>

                            <select
                                id="role-filter"
                                value={roleId}
                                onChange={(event) =>
                                    setRoleId(event.target.value)
                                }
                                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="">Semua Role</option>

                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="border-b border-slate-800 bg-background text-xs tracking-wider text-slate-400 uppercase">
                                <tr>
                                    <th className="px-6 py-3.5 font-medium">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3.5 font-medium">
                                        Dibuat Oleh
                                    </th>
                                    <th className="px-6 py-3.5 text-right font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-800 bg-background">
                                {user.data.length > 0 ? (
                                    user.data.map((item) => {
                                        const admin = isAdmin(item);
                                        const locked = isLocked(item);

                                        return (
                                            <tr
                                                key={item.id}
                                                className="transition-colors hover:bg-slate-800/50"
                                            >
                                                <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-100">
                                                    <div className="flex items-center gap-2">
                                                        <span>{item.name}</span>

                                                        {!admin && locked && (
                                                            <span
                                                                title="Akun terkunci"
                                                                className="inline-flex items-center gap-1 rounded-md border border-red-700 bg-red-900/30 px-1.5 py-0.5 text-xs text-red-400"
                                                            >
                                                                <Lock className="h-3 w-3" />
                                                                Terkunci
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                                    {item.creator?.name ?? '-'}
                                                </td>

                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(item)
                                                            }
                                                            title="Edit pengguna"
                                                            className="rounded-md p-1.5 text-indigo-400 transition-colors hover:bg-indigo-500/10 hover:text-indigo-300"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>

                                                        {!admin && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleToggleLock(
                                                                        item,
                                                                    )
                                                                }
                                                                title={
                                                                    locked
                                                                        ? 'Buka kunci pengguna'
                                                                        : 'Kunci pengguna'
                                                                }
                                                                className={`rounded-md p-1.5 transition-colors ${
                                                                    locked
                                                                        ? 'text-red-500 hover:bg-red-500/10 hover:text-red-400'
                                                                        : 'text-slate-400 hover:bg-slate-500/10 hover:text-slate-200'
                                                                }`}
                                                            >
                                                                {locked ? (
                                                                    <Lock className="h-4 w-4" />
                                                                ) : (
                                                                    <LockOpen className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id,
                                                                )
                                                            }
                                                            title="Hapus pengguna"
                                                            className="rounded-md p-1.5 text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                                                    <FolderOpen className="h-6 w-6" />
                                                </div>

                                                <p className="text-base font-medium text-slate-300">
                                                    Tidak Ada Pengguna
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {roleId
                                                        ? 'Tidak ada pengguna dengan role yang dipilih.'
                                                        : 'Data pengguna saat ini masih kosong.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {user.data.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-slate-800 bg-slate-900/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-400">
                                Menampilkan {user.data.length} dari {user.total}{' '}
                                pengguna
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {user.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url ?? '#'}
                                        preserveScroll
                                        onClick={(event) => {
                                            if (!link.url) {
                                                event.preventDefault();
                                            }
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                  ? 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                  : 'cursor-not-allowed border border-slate-800 bg-slate-900 text-slate-600'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AppModal
                open={modalOpen}
                onClose={handleCloseModal}
                title={selectedUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
            >
                <UserForm
                    key={selectedUser?.id ?? 'create'}
                    roles={roles}
                    user={selectedUser}
                    onClose={handleCloseModal}
                />
            </AppModal>
        </>
    );
}
