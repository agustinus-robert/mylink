import type { FormDataConvertible } from '@inertiajs/core';

export interface Province {
    id: number;
    name: string;
}

export interface District {
    id: number;
    province_id: number;
    name: string;
}

interface Props {
    data: {
        province_id: number;
        district_id: number;
        address: string;
    };
    setData: (key: string, value: FormDataConvertible) => void;
    errors: Record<string, string>;
    provinces: Province[];
    districts: District[];
}

const inputClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-50';

const labelClass = 'mb-1 block text-sm font-medium text-foreground';

const errorClass = 'mt-1 text-sm text-destructive';

export default function IncomingFormRegion({
    data,
    setData,
    errors,
    provinces,
    districts,
}: Props) {
    const filteredDistricts = districts.filter(
        (district) => district.province_id === data.province_id,
    );

    return (
        <section className="border-b border-border p-6">
            <h3 className="mb-4 text-base font-semibold text-foreground">
                Informasi Wilayah
            </h3>

            <div className="grid gap-4">
                <div className="grid gap-2 md:grid-cols-2">
                    <div>
                        <label htmlFor="province_id" className={labelClass}>
                            Provinsi
                        </label>

                        <select
                            id="province_id"
                            value={data.province_id}
                            onChange={(e) => {
                                setData('province_id', Number(e.target.value));
                                setData('district_id', 0);
                            }}
                            className={inputClass}
                        >
                            <option value={0}>Pilih Provinsi</option>

                            {provinces.map((province) => (
                                <option key={province.id} value={province.id}>
                                    {province.name}
                                </option>
                            ))}
                        </select>

                        {errors.province_id && (
                            <p className={errorClass}>{errors.province_id}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="district_id" className={labelClass}>
                            Distrik
                        </label>

                        <select
                            id="district_id"
                            value={data.district_id}
                            onChange={(e) => {
                                setData('district_id', Number(e.target.value));
                            }}
                            disabled={data.province_id === 0}
                            className={inputClass}
                        >
                            <option value={0}>
                                {data.province_id === 0
                                    ? 'Pilih Provinsi Terlebih Dahulu'
                                    : 'Pilih Distrik'}
                            </option>

                            {filteredDistricts.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>

                        {errors.district_id && (
                            <p className={errorClass}>{errors.district_id}</p>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-1">
                    <label htmlFor="address" className={labelClass}>
                        Alamat
                    </label>

                    <textarea
                        id="address"
                        name="address"
                        value={data.address}
                        onChange={(e) => {
                            setData('address', e.target.value);
                        }}
                        placeholder="Masukkan Alamat"
                        className={inputClass}
                    />

                    {errors.address && (
                        <p className={errorClass}>{errors.address}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
