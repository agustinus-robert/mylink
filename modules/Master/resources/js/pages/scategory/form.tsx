import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';

interface CategoryOption {
    id: number;
    name: string;
}

interface SubCategory {
    id: number;
    category_id: number;
    name: string;
    price: string;
}

interface Props {
    categories: CategoryOption[];
    category?: SubCategory;
    onClose: () => void;
}

interface FormData {
    category_id: number;
    name: string;
    price: string;
}

export default function SubCategoryForm({
    categories,
    category,
    onClose,
}: Props) {
    const { data, setData, post, put, processing, errors } =
        useForm<FormData>({
            category_id: category?.category_id ?? 0,
            name: category?.name ?? '',
            price: category?.price ?? '',
        });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                toast.success(
                    category
                        ? 'Sub kategori berhasil diperbarui.'
                        : 'Sub kategori berhasil ditambahkan.',
                );

                onClose();
            },
            onError: () => {
                toast.error('Gagal menyimpan sub kategori.');
            },
        };

        if (category) {
            put(
                route('master.sub-category.update', {
                    sub_category: category.id,
                }),
                options,
            );
        } else {
            post(route('master.sub-category.store'), options);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset disabled={processing}>
                <div className="border-b border-slate-800 px-6 py-4">
                    <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-100">
                        <ListTree />
                        {category
                            ? 'Edit Sub Kategori'
                            : 'Tambah Sub Kategori'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {category
                            ? 'Perbarui data sub kategori.'
                            : 'Tambahkan sub kategori baru ke dalam sistem.'}
                    </p>
                </div>

                <div className="space-y-4 p-6">
                    <div>
                        <label
                            htmlFor="category_id"
                            className="mb-1 block text-sm font-medium"
                        >
                            Kategori
                        </label>

                        <select
                            id="category_id"
                            name="category_id"
                            value={data.category_id || ''}
                            onChange={(e) =>
                                setData(
                                    'category_id',
                                    Number(e.target.value),
                                )
                            }
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        >
                            <option value="">Pilih Kategori</option>

                            {categories.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        {errors.category_id && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.category_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium"
                        >
                            Nama Sub Kategori
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                            placeholder="Masukkan nama sub kategori"
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
                            htmlFor="price"
                            className="mb-1 block text-sm font-medium"
                        >
                            Harga
                        </label>

                        <input
                            type="number"
                            id="price"
                            name="price"
                            min="0"
                            step="0.01"
                            value={data.price}
                            onChange={(e) =>
                                setData('price', e.target.value)
                            }
                            placeholder="Masukkan harga"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.price && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.price}
                            </p>
                        )}
                    </div>
                </div>
            </fieldset>

            <div className="flex justify-end gap-2 border-t border-slate-800 px-6 py-4">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={processing}
                    className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Batal
                </button>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing
                        ? 'Menyimpan...'
                        : category
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
