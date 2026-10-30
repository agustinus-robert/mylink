import { Link, Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { router } from '@inertiajs/react';
import { Pencil, Trash, FolderOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CoreTag {
    id: number;
    name: string;
    slug: string;
    creator: {
        id: number;
        name: string;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    ctag: {
        data: CoreTag[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
}

export default function Category({ ctag }: Props) {
    function handleDelete(id: number) {
        if (!confirm('Apakah Anda yakin ingin menghapus core tag ini?')) {
            return;
        }

        router.delete(
            route('master.core-tag.destroy', {
                core_tag: id,
            }),
            {
                onSuccess: () => {
                    toast.success('Core Tag berhasil dihapus.');
                },
                onError: () => {
                    toast.error('Gagal menghapus core tag.');
                },
            },
        );
    }
    return (
        <>
            <Head title="Kategori" />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-background shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 bg-background px-6 py-4">
                        <h2 className="text-lg font-semibold text-slate-100">
                            Daftar Tag
                        </h2>

                        <Link
                            href={route('master.core-tag.create')}
                            className="btn rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white"
                        >
                            Tambah
                        </Link>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="border-b border-slate-800 bg-background text-xs tracking-wider text-slate-400 uppercase">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3.5 font-medium"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3.5 font-medium"
                                    >
                                        Slug
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3.5 font-medium"
                                    >
                                        Dibuat Oleh
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3.5 text-right font-medium"
                                    >
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 bg-background">
                                {ctag.data.length > 0 ? (
                                    ctag.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors hover:bg-slate-800/50"
                                        >
                                            <td className="px-6 py-4 font-medium whitespace-nowrap text-slate-100">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="bg-background-800 inline-flex items-center rounded-full border border-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-300">
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
                                                            'master.core-tag.edit',
                                                            item.id,
                                                        )}
                                                        className="inline-flex items-center gap-1.5 font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                                                    >
                                                        <Pencil className="h-4 w-4" />{' '}
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
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
                                                    Data tag saat ini masih
                                                    kosong.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {ctag.data.length > 0 && (
                        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/50 px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                                {ctag.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url ?? '#'}
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
        </>
    );
}
