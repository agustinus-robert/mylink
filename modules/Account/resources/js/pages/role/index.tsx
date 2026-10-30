import { Link, Head, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState } from 'react';
import { Pencil, Trash, FolderOpen, ListTodo, Plus } from 'lucide-react';
import { toast } from 'sonner';
import AppModal from '../../../../../../resources/js/components/app-modal';
import RoleForm from './form';

interface PageProps {
    [key: string]: unknown;
    can: Record<string, boolean>;
}

interface Role {
    id: number;
    name: string;
    slug: string;
    creator: {
        id: number;
        name: string;
    } | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    role: {
        data: Role[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
}

export default function Role({ role }: Props) {
    const { can } = usePage<PageProps>().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | undefined>(
        undefined,
    );

    function handleCreate() {
        setSelectedRole(undefined);
        setModalOpen(true);
    }

    function handleEdit(item: Role) {
        setSelectedRole(item);
        setModalOpen(true);
    }

    function handleCloseModal() {
        setModalOpen(false);
        setSelectedRole(undefined);
    }

    function handleDelete(id: number) {
        if (!confirm('Apakah Anda yakin ingin menghapus role ini?')) {
            return;
        }

        router.delete(route('account.role.destroy', { role: id }), {
            onSuccess: () => {
                toast.success('Role berhasil dihapus.');
            },
            onError: () => {
                toast.error('Role gagal dihapus.');
            },
        });
    }

    return (
        <>
            <Head title="Role" />

            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-background shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 bg-background px-6 py-4">
                        <h2 className="text-lg font-semibold text-slate-100">
                            Daftar Role
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

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="border-b border-slate-800 bg-background text-xs tracking-wider text-slate-400 uppercase">
                                <tr>
                                    <th className="px-6 py-3.5 font-medium">
                                        Name
                                    </th>
                                    <th className="px-6 py-3.5 font-medium">
                                        Slug
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
                                {role.data.length > 0 ? (
                                    role.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors hover:bg-slate-800/50"
                                        >
                                            <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-100">
                                                {item.name}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center rounded-full border border-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                                                    {item.slug}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                                {item.creator?.name ?? '-'}
                                            </td>

                                            <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={route(
                                                            'account.role-permission.show',
                                                            item.id,
                                                        )}
                                                        title="Pengaturan permission"
                                                        className="inline-flex items-center gap-1.5 font-medium text-stone-400 transition-colors hover:text-indigo-300"
                                                    >
                                                        <ListTodo className="h-4 w-4" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        title="Edit role"
                                                        className="inline-flex items-center gap-1.5 font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(item.id)
                                                        }
                                                        title="Hapus role"
                                                        className="inline-flex items-center gap-1.5 font-medium text-rose-400 transition-colors hover:text-rose-300"
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                                                    <FolderOpen className="h-6 w-6" />
                                                </div>

                                                <p className="text-base font-medium text-slate-300">
                                                    Belum Ada Data
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Data role saat ini masih
                                                    kosong.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {role.data.length > 0 && (
                        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/50 px-6 py-4">
                            <p className="text-xs text-slate-400">
                                Total {role.total} role
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {role.links.map((link, index) => (
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
                title={selectedRole ? 'Edit Role' : 'Tambah Role'}
            >
                <RoleForm
                    key={selectedRole?.id ?? 'create'}
                    role={selectedRole}
                    onClose={handleCloseModal}
                />
            </AppModal>
        </>
    );
}
