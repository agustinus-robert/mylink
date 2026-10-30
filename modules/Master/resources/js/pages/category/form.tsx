
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';

interface Category {
    id: number;
    code: string;
    name: string;
}

interface Props {
    category?: Category;
    onClose: () => void;
}

interface FormData {
    name: string;
    code: string;
}

export default function CategoryForm({ category, onClose }: Props) {
    const { setData, post, put, processing, errors } =
        useForm<FormData>({
            code: category?.code ?? '',
            name: category?.name ?? '',
        });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        setData({
            code: String(formData.get('code') ?? ''),
            name: String(formData.get('name') ?? ''),
        });

        const payload = {
            code: String(formData.get('code') ?? ''),
            name: String(formData.get('name') ?? ''),
        };

        if (category) {
            put(
                route('master.category.update', {
                    category: category.id,
                }),
                {
                    onSuccess: () => {
                        toast.success('Kategori berhasil diperbarui.');
                        onClose();
                    },
                    onError: () => {
                        toast.error('Gagal memperbarui kategori.');
                    },
                },
            );
        } else {
            post(route('master.category.store'), {
                onSuccess: () => {
                    toast.success('Kategori berhasil ditambahkan.');
                    onClose();
                },
                onError: () => {
                    toast.error('Gagal menambahkan kategori.');
                },
            });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset disabled={processing}>
                <div className="border-b border-slate-800 px-6 py-4">
                    <h2 className="flex gap-3 text-lg font-semibold text-slate-100">
                        <ListTree />
                        {category ? 'Pembaruan Kategori' : 'Buat Kategori'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {category
                            ? 'Perbarui data kategori yang sudah ada.'
                            : 'Tambahkan kategori baru ke dalam sistem.'}
                    </p>
                </div>

                <div className="space-y-4 p-6">
                    <div>
                        <label
                            htmlFor="code"
                            className="mb-1 block text-sm font-medium"
                        >
                            Kode Kategori
                        </label>

                        <input
                            type="text"
                            id="code"
                            name="code"
                            defaultValue={category?.code ?? ''}
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.code && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.code}
                            </p>
                        )}
                    </div>

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
                            defaultValue={category?.name ?? ''}
                            placeholder="Masukkan nama kategori"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.name}
                            </p>
                        )}
                    </div>
                </div>
            </fieldset>

            <div className="flex justify-end gap-2 border-t border-slate-800 px-6 py-4">
                <button
                    type="button"
                    disabled={processing}
                    onClick={() => window.history.back()}
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
                        ? category
                            ? 'Memperbarui...'
                            : 'Menyimpan...'
                        : category
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}