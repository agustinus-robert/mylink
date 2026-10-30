import { FormDataConvertible } from '@inertiajs/core';
import dayjs from 'dayjs';

export interface Pricing {
    id: number;
    prices: number;
    recorded_at: string;
}

interface Props {
    data: {
        prices: number;
        recorded_at: string;
    };
    setData: (key: string, value: FormDataConvertible) => void;
    errors: Record<string, string>;
}

const inputClass =
    'w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50';

export default function IncomingFormPricing({ data, setData, errors }: Props) {
    return (
        <section className="border-b border-slate-800 p-6">
            <h3 className="mb-4 text-base font-semibold text-slate-100">
                Informasi Harga Barang
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="prices" className="mb-1 block text-sm">
                        Harga Barang
                    </label>

                    <input
                        type="number"
                        id="prices"
                        value={data.prices}
                        onChange={(e) => setData('prices', e.target.value)}
                        className={inputClass}
                    />

                    {errors.incoming_from && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.incoming_from}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="incoming_from"
                        className="mb-1 block text-sm"
                    >
                        Perubahan Tanggal Affiliasi
                    </label>

                    <input
                        type="text"
                        id="incoming_from"
                        value={
                            data.recorded_at
                                ? dayjs(data.recorded_at).format('DD/MM/YYYY')
                                : ''
                        }
                        onChange={(e) => {
                            const value = e.target.value;
                            setData(
                                'recorded_at',
                                value
                                    ? dayjs(value, 'DD/MM/YYYY').format(
                                          'YYYY-MM-DD',
                                      )
                                    : '',
                            );
                        }}
                        placeholder="DD/MM/YYYY"
                        className={inputClass}
                    />
                    {errors.incoming_from && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.incoming_from}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
