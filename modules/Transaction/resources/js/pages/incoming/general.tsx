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
        affiliate_link: string;
    };
    setData: (key: string, value: FormDataConvertible) => void;
    categories: Category[];
    subCategories: SubCategory[];
    errors: Record<string, string>;
    currentFile?: string | null;
}

const inputClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

const labelClass = 'mb-1 block text-sm font-medium text-foreground';

const errorClass = 'mt-1 text-sm text-destructive';

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
        <section className="border-b border-border p-6">
            <h3 className="mb-4 text-base font-semibold text-foreground">
                Informasi Transaksi
            </h3>

            <div className="grid gap-4">
                <div>
                    <label htmlFor="code" className={labelClass}>
                        Code
                    </label>

                    <input
                        type="text"
                        id="code"
                        placeholder="isian code anda (eg: CDE-01)"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        className={inputClass}
                    />

                    {errors.code && <p className={errorClass}>{errors.code}</p>}
                </div>

                <div>
                    <label htmlFor="name" className={labelClass}>
                        Nama Barang
                    </label>

                    <input
                        type="text"
                        id="name"
                        placeholder="isian nama barang (eg: Router, Kabel Belden, Switch & Hub)"
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

                    {errors.name && <p className={errorClass}>{errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="slug" className={labelClass}>
                        Slug
                    </label>

                    <input
                        type="text"
                        id="slug"
                        placeholder="Slug otomatis setelah mengisi nama barang"
                        disabled
                        value={data.slug}
                        className={inputClass}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="category_id" className={labelClass}>
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
                            <p className={errorClass}>{errors.category_id}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="sub_category_id" className={labelClass}>
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
                            className={inputClass}
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
                            <p className={errorClass}>
                                {errors.sub_category_id}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="link" className={labelClass}>
                        Tautan Gambar
                    </label>

                    <input
                        type="text"
                        id="link"
                        placeholder="tautan gambar dari afiliasi eg: shopee, tokopedia, lazada"
                        value={data.link}
                        onChange={(e) => setData('link', e.target.value)}
                        className={inputClass}
                    />

                    {errors.link && <p className={errorClass}>{errors.link}</p>}
                </div>

                <div>
                    <label htmlFor="affiliate_link" className={labelClass}>
                        Tautan Afiliasi
                    </label>

                    <input
                        type="text"
                        id="affiliate_link"
                        placeholder="tautan dari afiliasi eg: shopee, tokopedia, lazada"
                        value={data.affiliate_link}
                        onChange={(e) =>
                            setData('affiliate_link', e.target.value)
                        }
                        className={inputClass}
                    />

                    {errors.affiliate_link && (
                        <p className={errorClass}>{errors.affiliate_link}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
