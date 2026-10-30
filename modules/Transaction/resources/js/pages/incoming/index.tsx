import { useEffect, useRef, useState } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    Pencil,
    Trash,
    FolderOpen,
    Search,
    FileSpreadsheet,
    X,
    Printer,
    Check,
    ArrowUpDown,
} from 'lucide-react';
import { toast } from 'sonner';

interface IncomingItem {
    id: number;
    name: string;
    harga: number | string;
    qty: number;
    uom: string;
    total: number | string;
    expired: string | null;
}

interface Incoming {
    id: number;
    name: string;
    slug: string;
    is_verified?: boolean | number;
    detail?: {
        id: number;
        prices: string;
    } | null;
    category?: {
        id: number;
        name: string;
    } | null;
    sub_category?: {
        id: number;
        name: string;
    } | null;
    subCategory?: {
        id: number;
        name: string;
    } | null;
    creator?: {
        id: number;
        name: string;
    } | null;
    items?: IncomingItem[];
    created_at: string;
}

interface Category {
    id: number;
    name: string;
}

interface SubCategory {
    id: number;
    name: string;
    category_id: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Filters extends Record<string, string | undefined> {
    search?: string;
    category_id?: string;
    sub_category_id?: string;
    year?: string;
    sort?: string;
    direction?: string;
    dateFrom?: string;
    dateTo?: string;
    archived?: string;
}

interface Props {
    incomings?: {
        data: Incoming[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    filters?: Filters;
    categories?: Category[];
    subCategories?: SubCategory[];
    years?: number[];
    isAdmin?: boolean;
}

export default function IncomingIndex({
    incomings,
    filters = {},
    categories = [],
    subCategories = [],
    years = [],
    isAdmin = false,
}: Props) {
    const data = incomings?.data ?? [];
    const links = incomings?.links ?? [];

    const [search, setSearch] = useState(filters.search ?? '');
    const [categoryId, setCategoryId] = useState(filters.category_id ?? '');
    const [subCategoryId, setSubCategoryId] = useState(
        filters.sub_category_id ?? '',
    );
    const [year, setYear] = useState(filters.year ?? '');
    const [verifyingIds, setVerifyingIds] = useState<number[]>([]);

    const initialSearch = useRef(true);

    const filteredSubCategories = subCategories.filter(
        (item) => String(item.category_id) === categoryId,
    );

    useEffect(() => {
        if (initialSearch.current) {
            initialSearch.current = false;
            return;
        }

        const timeout = window.setTimeout(() => {
            const params: Filters = {
                ...filters,
                search: search.trim(),
                category_id: categoryId,
                sub_category_id: subCategoryId,
                year,
                page: undefined,
            };

            Object.keys(params).forEach((key) => {
                if (!params[key]) {
                    delete params[key];
                }
            });

            router.get(route('transaction.incoming.index'), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [search]);

    function applyFilters(overrides: Filters = {}) {
        const params: Filters = {
            ...filters,
            search: search.trim(),
            category_id: categoryId,
            sub_category_id: subCategoryId,
            year,
            ...overrides,
            page: undefined,
        };

        Object.keys(params).forEach((key) => {
            if (!params[key]) {
                delete params[key];
            }
        });

        router.get(route('transaction.incoming.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    function handleResetSearch() {
        setSearch('');
    }

    function handleCategoryChange(value: string) {
        setCategoryId(value);
        setSubCategoryId('');

        applyFilters({
            category_id: value,
            sub_category_id: '',
        });
    }

    function handleSubCategoryChange(value: string) {
        setSubCategoryId(value);
        applyFilters({ sub_category_id: value });
    }

    function handleYearChange(value: string) {
        setYear(value);
        applyFilters({ year: value });
    }

    function handleSort(column: string) {
        const currentSort = filters.sort ?? 'date';
        const direction =
            currentSort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        applyFilters({ sort: column, direction });
    }

    function handleExport() {
        const params = new URLSearchParams();

        Object.entries({
            ...filters,
            search: search.trim(),
            category_id: categoryId,
            sub_category_id: subCategoryId,
            year,
        }).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.set(key, String(value));
            }
        });

        const query = params.toString();
        const exportUrl = route('transaction.incoming.export');

        window.location.href = query ? `${exportUrl}?${query}` : exportUrl;
    }

    function handlePrint(id: number) {
        window.open(
            route('transaction.incoming.receipt', {
                incoming: id,
            }),
            '_blank',
            'noopener,noreferrer',
        );
    }

    function handleVerify(id: number) {
        if (!isAdmin) {
            toast.error('Hanya admin yang dapat memverifikasi invoice.');
            return;
        }

        if (verifyingIds.includes(id)) {
            return;
        }

        setVerifyingIds((current) => [...current, id]);

        router.post(
            route('transaction.incoming.verify', {
                incoming: id,
            }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Invoice berhasil diverifikasi.');
                },
                onError: () => {
                    toast.error('Gagal memverifikasi invoice.');
                },
                onFinish: () => {
                    setVerifyingIds((current) =>
                        current.filter((itemId) => itemId !== id),
                    );
                },
            },
        );
    }

    function handleDelete(id: number) {
        if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            return;
        }

        router.delete(
            route('transaction.incoming.destroy', {
                incoming: id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Transaksi berhasil dihapus.');
                },
                onError: () => {
                    toast.error('Gagal menghapus transaksi.');
                },
            },
        );
    }

    const formatCurrency = (value: number | string) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(value));

    const formatDate = (value: string) =>
        new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(value));

    return (
        <>
            <Head title="Barang Masuk" />

            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-background shadow-xl">
                    <div className="flex flex-col gap-4 border-b border-slate-800 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-semibold text-slate-100">
                            Daftar Barang Masuk
                        </h2>

                        <Link
                            href={route('transaction.incoming.create')}
                            className="rounded-md bg-slate-800 px-4 py-2 text-center text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Tambah
                        </Link>
                    </div>

                    <div className="space-y-4 border-b border-slate-800 px-6 py-4">
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="relative min-w-0 flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari asal barang atau subkategori..."
                                    className="w-full rounded-md border border-slate-700 bg-slate-900 py-2.5 pr-9 pl-9 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-500"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={handleResetSearch}
                                        title="Hapus pencarian"
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 hover:text-white"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleExport}
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                Export Excel
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <select
                                value={categoryId}
                                onChange={(e) =>
                                    handleCategoryChange(e.target.value)
                                }
                                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100"
                            >
                                <option value="">Semua Kategori</option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={subCategoryId}
                                onChange={(e) =>
                                    handleSubCategoryChange(e.target.value)
                                }
                                disabled={!categoryId}
                                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 disabled:opacity-50"
                            >
                                <option value="">Semua Subkategori</option>

                                {filteredSubCategories.map((subcategory) => (
                                    <option
                                        key={subcategory.id}
                                        value={subcategory.id}
                                    >
                                        {subcategory.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={year}
                                onChange={(e) =>
                                    handleYearChange(e.target.value)
                                }
                                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100"
                            >
                                <option value="">Semua Tahun</option>

                                {years.map((itemYear) => (
                                    <option key={itemYear} value={itemYear}>
                                        {itemYear}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="border-b border-slate-800 text-xs tracking-wider text-slate-400 uppercase">
                                <tr>
                                    <th className="px-6 py-3.5 font-medium">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSort('incoming_from')
                                            }
                                            className="inline-flex items-center gap-2 hover:text-white"
                                        >
                                            Nama Barang
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </button>
                                    </th>

                                    <th className="px-6 py-3.5 font-medium">
                                        Kategori
                                    </th>

                                    <th className="px-6 py-3.5 font-medium">
                                        Subkategori
                                    </th>

                                    <th className="px-6 py-3.5 font-medium">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('date')}
                                            className="inline-flex items-center gap-2 hover:text-white"
                                        >
                                            Tanggal
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </button>
                                    </th>

                                    <th className="px-6 py-3.5 font-medium">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSort('grand_total')
                                            }
                                            className="inline-flex items-center gap-2 hover:text-white"
                                        >
                                            Total
                                            <ArrowUpDown className="h-3.5 w-3.5" />
                                        </button>
                                    </th>

                                    <th className="px-6 py-3.5 text-right font-medium">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-800">
                                {data.length > 0 ? (
                                    data.map((item) => {
                                        const verified =
                                            item.is_verified === true ||
                                            Number(item.is_verified) === 1;

                                        const verifying = verifyingIds.includes(
                                            item.id,
                                        );

                                        return (
                                            <tr
                                                key={item.id}
                                                className="transition-colors hover:bg-slate-800/50"
                                            >
                                                <td className="px-6 py-4 font-medium text-slate-100">
                                                    {item.name}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.category?.name ?? '-'}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.sub_category?.name ??
                                                        item.subCategory
                                                            ?.name ??
                                                        '-'}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatDate(
                                                        item.created_at,
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {formatCurrency(
                                                        item.detail?.prices ??
                                                            0,
                                                    )}
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        {verified && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handlePrint(
                                                                        item.id,
                                                                    )
                                                                }
                                                                title="Cetak nota invoice"
                                                                className="text-slate-400 hover:text-white"
                                                            >
                                                                <Printer className="h-4 w-4" />
                                                            </button>
                                                        )}

                                                        <Link
                                                            href={route(
                                                                'transaction.incoming.edit',
                                                                {
                                                                    incoming:
                                                                        item.id,
                                                                },
                                                            )}
                                                            className="text-indigo-400 hover:text-indigo-300"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="text-rose-400 hover:text-rose-300"
                                                            title="Hapus"
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
                                            colSpan={9}
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                                                    <FolderOpen className="h-6 w-6" />
                                                </div>

                                                <p className="text-base font-medium text-slate-300">
                                                    Belum Ada Data
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {search
                                                        ? 'Tidak ada data yang cocok dengan pencarian.'
                                                        : 'Data barang masuk masih kosong.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {data.length > 0 && (
                        <div className="flex flex-col gap-4 border-t border-slate-800 bg-slate-900/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-400">
                                Halaman {incomings?.current_page ?? 1} dari{' '}
                                {incomings?.last_page ?? 1} · Total{' '}
                                {incomings?.total ?? data.length} transaksi
                            </p>

                            <div className="flex flex-wrap gap-1">
                                {links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url ?? '#'}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`rounded-md px-3 py-1.5 text-xs font-medium ${
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
        </>
    );
}
