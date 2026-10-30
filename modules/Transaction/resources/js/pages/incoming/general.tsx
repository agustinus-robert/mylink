import type { FormDataConvertible } from '@inertiajs/core';

export interface Category {
    id: number;
    name: string;
}

export interface SubCategory {
    id: number;
    category_id: number;
    name: string;
    price: string;
}

interface Props {
    data: {
        code: string;
        name: string;
        slug: string;
        link: string;
        category_id: number;
        sub_category_id: number;
    };
    setData: (key: string, value: FormDataConvertible) => void;
    categories: Category[];
    subCategories: SubCategory[];
    errors: Record<string, string>;
    currentFile?: string | null;
}

const inputClass =
    'w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary';

export default function IncomingFormGeneral({
    data,
    setData,
    categories,
    subCategories,
    errors,
    currentFile,
}: Props) {
    const filteredSubCategories = subCategories.filter(
        (subCategory) => subCategory.category_id === Number(data.category_id),
    );

    const selectedSubCategory = filteredSubCategories.find(
        (subCategory) => subCategory.id === Number(data.sub_category_id),
    );

    return (
        <section className="border-b border-slate-800 p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-100">
                Informasi Transaksi
            </h3>

            <div className="grid gap-4">
                <div>
                    <label htmlFor="code" className="mb-1 block text-sm">
                        Code
                    </label>

                    <input
                        type="text"
                        id="name"
                        value={data.code}
                        onChange={(e) => {
                            const code = e.target.value;
                            setData('code', code);
                        }}
                        className={inputClass}
                    />

                    {errors.code && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.code}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="incoming_from"
                        className="mb-1 block text-sm"
                    >
                        Nama Barang
                    </label>

                    <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => {
                            const name = e.target.value;

                            setData('name', name);
                            setData(
                                'slug',
                                name
                                    .toLowerCase()
                                    .trim()
                                    .replace(/[^a-z0-9\s-]/g, '')
                                    .replace(/\s+/g, '-')
                                    .replace(/-+/g, '-'),
                            );
                        }}
                        className={inputClass}
                    />

                    {errors.name && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="slug" className="mb-1 block text-sm">
                        Slug
                    </label>

                    <input
                        type="text"
                        id="incoming_from"
                        disabled
                        value={data.slug}
                        className={inputClass}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="category_id"
                            className="mb-1 block text-sm"
                        >
                            Kategori
                        </label>

                        <select
                            id="category_id"
                            value={data.category_id}
                            onChange={(e) => {
                                setData('category_id', Number(e.target.value));
                                setData('sub_category_id', 0);
                            }}
                            className={inputClass}
                        >
                            <option value={0}>Pilih Kategori</option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
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
                            htmlFor="sub_category_id"
                            className="mb-1 block text-sm"
                        >
                            Subkategori
                        </label>

                        <select
                            id="sub_category_id"
                            value={data.sub_category_id}
                            onChange={(e) =>
                                setData(
                                    'sub_category_id',
                                    Number(e.target.value),
                                )
                            }
                            disabled={!data.category_id}
                            className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            <option value={0}>
                                {data.category_id
                                    ? 'Pilih Subkategori'
                                    : 'Pilih Kategori Dahulu'}
                            </option>

                            {filteredSubCategories.map((subCategory) => (
                                <option
                                    key={subCategory.id}
                                    value={subCategory.id}
                                >
                                    {subCategory.name}
                                </option>
                            ))}
                        </select>

                        {errors.sub_category_id && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.sub_category_id}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="incoming_from"
                        className="mb-1 block text-sm"
                    >
                        Tautan Gambar
                    </label>

                    <input
                        type="text"
                        id="link_image"
                        value={data.link}
                        onChange={(e) => {
                            let link = e.target.value;
                            setData('link', link);
                        }}
                        className={inputClass}
                    />

                    {errors.link && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.link}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
