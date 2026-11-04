import type { FormDataConvertible } from '@inertiajs/core';
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
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50';

const labelClass = 'mb-1 block text-sm font-medium text-foreground';

const errorClass = 'mt-1 text-sm text-destructive';

export default function IncomingFormPricing({ data, setData, errors }: Props) {
    return (
        <section className="border-b border-border p-6">
            <h3 className="mb-4 text-base font-semibold text-foreground">
                Informasi Harga Barang
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label htmlFor="prices" className={labelClass}>
                        Harga Barang
                    </label>

                    <input
                        type="number"
                        id="prices"
                        value={data.prices}
                        onChange={(e) => setData('prices', e.target.value)}
                        className={inputClass}
                    />

                    {errors.prices && (
                        <p className={errorClass}>{errors.prices}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="recorded_at" className={labelClass}>
                        Perubahan Tanggal Affiliasi
                    </label>

                    <input
                        type="date"
                        id="recorded_at"
                        value={data.recorded_at ? data.recorded_at : ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            setData('recorded_at', value);
                        }}
                        placeholder="DD/MM/YYYY"
                        className={inputClass}
                    />

                    {errors.recorded_at && (
                        <p className={errorClass}>{errors.recorded_at}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
