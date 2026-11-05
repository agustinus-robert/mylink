import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';

import IncomingFormGeneral, {
    type Category,
    type SubCategory,
} from './general';

import IncomingFormRegion, { type Province, type District } from './region';
import IncomingFormPricing from './pricing';
import IncomingFormHash from './hash';

interface Incoming {
    id: number;
    code: string;
    name: string;
    slug: string;
    detail?: {
        prices: number;
        recorded_at: string;
        location?: {
            address: string;
            province?: {
                id: number;
                name: string;
            };
            district?: {
                id: number;
                name: string;
            };
        };
    };
    link: string;
    affiliate_link: string;
    address: string;
    province_id: number;
    district_id: number;
    category_id: number;
    sub_category_id: number;
    prices: number;
    recorded_at: string;
    topic: string;
}

interface Props {
    incoming?: Incoming;
    categories: Category[];
    subCategories: SubCategory[];
    provinces: Province[];
    districts: District[];
}

type FormData = Omit<Incoming, 'id'>;

export default function Form({
    incoming,
    categories,
    subCategories,
    provinces,
    districts,
}: Props) {
    const { data, setData, post, transform, processing, errors } =
        useForm<FormData>({
            code: incoming?.code ?? '',
            name: incoming?.name ?? '',
            slug: incoming?.slug ?? '',
            link: incoming?.link ?? '',
            affiliate_link: incoming?.affiliate_link ?? '',
            category_id: incoming?.category_id ?? 0,
            sub_category_id: incoming?.sub_category_id ?? 0,
            address: incoming?.detail?.location?.address ?? '',
            province_id: incoming?.detail?.location?.province?.id ?? 0,
            district_id: incoming?.detail?.location?.district?.id ?? 0,
            prices: incoming?.detail?.prices ?? 0,
            recorded_at: incoming?.detail?.recorded_at ?? '',
            topic: incoming?.name ?? '',
        });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (incoming) {
            transform((formData) => ({
                ...formData,
                _method: 'put',
            }));
        }

        post(
            incoming
                ? route('transaction.incoming.update', {
                      incoming: incoming.id,
                  })
                : route('transaction.incoming.store'),
            {
                forceFormData: true,
                onSuccess: () => {
                    toast.success(
                        incoming
                            ? 'Transaksi berhasil diperbarui.'
                            : 'Transaksi berhasil ditambahkan.',
                    );
                },
                onError: () => {
                    toast.error('Gagal menyimpan transaksi.');
                },
            },
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset disabled={processing}>
                <IncomingFormGeneral
                    data={data}
                    setData={setData}
                    categories={categories}
                    subCategories={subCategories}
                    errors={errors}
                />

                <IncomingFormRegion
                    data={data}
                    setData={setData}
                    errors={errors}
                    provinces={provinces}
                    districts={districts}
                />

                <IncomingFormPricing
                    data={data}
                    setData={setData}
                    errors={errors}
                />

                <IncomingFormHash
                    data={data}
                    setData={setData}
                    errors={errors}
                />
            </fieldset>

            <div className="flex justify-end gap-2 border-t border-slate-800 px-6 py-4">
                <button
                    type="button"
                    disabled={processing}
                    onClick={() => window.history.back()}
                    className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300"
                >
                    Kembali
                </button>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                    {processing
                        ? 'Menyimpan...'
                        : incoming
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
