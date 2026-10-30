import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';

interface Language {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    language?: Language;
}

interface FormData {
    name: string;
    slug: string;
}

export default function CategoryForm({ language }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<FormData>({
        name: language?.name ?? '',
        slug: language?.slug ?? '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (language) {
            put(
                route('master.language.update', {
                    language: language.id,
                }),
                {
                    onSuccess: () => {
                        toast.success('Pengaturan Bahasa berhasil masuk');
                    },

                    onError: () => {
                        toast.error('Gagal memperbarui pengaturan bahasa.');
                    },
                },
            );
        } else {
            post(route('master.language.store'), {
                onSuccess: () => {
                    toast.success('Pengaturan Bahasa berhasil ditambahkan.');
                },

                onError: () => {
                    toast.error('Gagal menambahkan pengaturan bahasa.');
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
                        {language ? 'Pembaruan Bahasa' : 'Buat Bahasa'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {language
                            ? 'Perbarui data bahasa yang sudah ada.'
                            : 'Tambahkan bahasa baru ke dalam sistem.'}
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
                            placeholder="Masukkan bahasa"
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
                        ? language
                            ? 'Memperbarui...'
                            : 'Menyimpan...'
                        : language
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
