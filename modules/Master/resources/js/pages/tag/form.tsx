import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';

interface Tag {
    id: number;
    name: string;
    slug: string;
    parent_id: number;
}

interface CoreTag {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    tag?: Tag;
    ctag: CoreTag[];
}

interface FormData {
    name: string;
    slug: string;
    parent_id: number;
}

export default function TagForm({ tag, ctag }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<FormData>({
        name: tag?.name ?? '',
        slug: tag?.slug ?? '',
        parent_id: tag?.parent_id ?? 0,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (tag) {
            put(
                route('master.tag.update', {
                    tag: tag.id,
                }),
                {
                    onSuccess: () => {
                        toast.success('Tag berhasil masuk');
                    },

                    onError: () => {
                        toast.error('Gagal memperbarui tag.');
                    },
                },
            );
        } else {
            post(route('master.tag.store'), {
                onSuccess: () => {
                    toast.success('Tag berhasil ditambahkan.');
                },

                onError: () => {
                    toast.error('Gagal menambahkan tag.');
                },
            });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset disabled={processing}>
                <div className="border-b border-slate-800 px-6 py-4">
                    <h2 className="flex gap-3 text-lg font-semibold text-slate-100">
                        <ListTree></ListTree>
                        {tag ? 'Pembaruan Tag' : 'Buat Tag'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {tag
                            ? 'Perbarui data tag yang sudah ada.'
                            : 'Tambahkan kategori baru ke dalam sistem.'}
                    </p>
                </div>

                <div className="space-y-4 p-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium"
                        >
                            Nama
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => {
                                const name = e.target.value;

                                setData({
                                    name,
                                    slug: name
                                        .toLowerCase()
                                        .trim()
                                        .replace(/\s+/g, '-')
                                        .replace(/[^\w-]/g, ''),
                                });
                            }}
                            placeholder="Masukkan nama tag"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="parent_id"
                            className="mb-1 block text-sm font-medium"
                        >
                            Core Tag
                        </label>

                        <select
                            id="parent_id"
                            name="parent_id"
                            value={data.parent_id}
                            onChange={(e) =>
                                setData('parent_id', Number(e.target.value))
                            }
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        >
                            <option value={0}>Pilih Core Tag</option>

                            {ctag.map((tags) => (
                                <option key={tags.id} value={tags.id}>
                                    {tags.name}
                                </option>
                            ))}
                        </select>

                        {errors.parent_id && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.parent_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="slug"
                            className="mb-1 block text-sm font-medium"
                        >
                            Slug
                        </label>

                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={data.slug}
                            readOnly
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none"
                        />
                    </div>
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
                    {processing
                        ? tag
                            ? 'Memperbarui...'
                            : 'Menyimpan...'
                        : tag
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
