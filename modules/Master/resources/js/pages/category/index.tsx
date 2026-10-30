import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useEffect, useState } from 'react';
import AppModal from '../../../../../../resources/js/components/app-modal';
import CategoryForm from './form';
import { Pencil, Trash, FolderOpen, Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
    id: number;
    code: string;
    name: string;
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
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    filters: {
        search?: string;
    };
}

export default function Category({ categories, filters }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        Category | undefined
    >(undefined);
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search === (filters.search ?? '')) {
                return;
            }

            router.get(
                route('master.category.index'),
                {
                    search: search.trim() || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, filters.search]);

    function handleCreate() {
        setSelectedCategory(undefined);
        setModalOpen(true);
    }

    function handleEdit(category: Category) {
        setSelectedCategory(category);
        setModalOpen(true);
    }

    function handleDelete(id: number) {
        if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            return;
        }

        router.delete(route('master.category.destroy', { category: id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Kategori berhasil dihapus.');
            },
            onError: () => {
                toast.error('Gagal menghapus kategori.');
            },
        });
    }

    function handleCloseModal() {
        setModalOpen(false);
        setSelectedCategory(undefined);
    }

    function handleClearSearch() {
        setSearch('');
    }

    return (
        <>
            <Head title="Kategori" />

            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-background shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 bg-background px-6 py-4">
                        <h2 className="text-lg font-semibold text-slate-100">
                            Daftar Kategori
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

                    {/* Pencarian kategori berdasarkan nama atau kode */}
                    <div className="border-b border-slate-800 px-6 py-4">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Cari nama atau kode kategori..."
                                aria-label="Cari nama atau kode kategori"
                                className="w-full rounded-md border border-slate-700 bg-slate-900 py-2 pr-9 pl-9 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    title="Hapus pencarian"
                                    aria-label="Hapus pencarian"
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="border-b border-slate-800 bg-background text-xs tracking-wider text-slate-400 uppercase">
                                <tr>
                                    <th className="px-6 py-3.5 font-medium">
                                        Kode
                                    </th>
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
                                {categories.data.length > 0 ? (
                                    categories.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors hover:bg-slate-800/50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                                                    {item.code}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-100">
                                                {item.name}
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
                                                        title="Edit kategori"
                                                        className="rounded-md p-1.5 text-indigo-400 transition-colors hover:bg-indigo-500/10 hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                        title="Hapus kategori"
                                                        className="rounded-md p-1.5 text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
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
                                                    {search
                                                        ? 'Kategori Tidak Ditemukan'
                                                        : 'Belum Ada Data'}
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {search
                                                        ? 'Tidak ada kategori yang cocok dengan pencarian.'
                                                        : 'Data kategori saat ini masih kosong.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {categories.data.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-slate-800 bg-slate-900/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-400">
                                Menampilkan {categories.data.length} dari{' '}
                                {categories.total} kategori
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {categories.links.map((link, index) => (
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
                title={selectedCategory ? 'Edit Kategori' : 'Tambah Kategori'}
            >
                <CategoryForm
                    key={selectedCategory?.id ?? 'create'}
                    category={selectedCategory}
                    onClose={handleCloseModal}
                />
            </AppModal>
        </>
    );
}
