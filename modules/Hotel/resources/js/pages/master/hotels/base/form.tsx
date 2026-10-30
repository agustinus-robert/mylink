import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';
import { HotelFormData, PropsForm, Regency, City } from './types';
import { useState, useEffect } from 'react';

export default function CategoryForm({
    hotel,
    province,
    regency,
    city,
}: PropsForm) {
    const [regencies, setRegencies] = useState<Regency[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const { data, setData, post, put, processing, errors } =
        useForm<HotelFormData>({
            name: hotel?.name ?? '',
            code: hotel?.code ?? '',
            phone: hotel?.phone ?? 0,
            email: hotel?.email ?? '',
            address: hotel?.address ?? '',
            city_id: hotel?.city_id ?? 0,
            regency_id: hotel?.regency_id ?? 0,
            province_id: hotel?.province_id ?? 0,
            latitude: hotel?.latitude ?? 0,
            longitude: hotel?.longitude ?? 0,
        });

    useEffect(() => {
        if (!data.province_id) {
            setRegencies([]);
            setCities([]);
            return;
        }

        const regencieData = regency.filter(
            (value) => value.province_id === data.province_id,
        );

        setRegencies(regencieData);

        if (!data.regency_id) {
            setCities([]);
            return;
        }

        const cityData = city.filter(
            (value) => value.regency_id === data.regency_id,
        );

        setCities(cityData);
    }, [data.province_id, data.regency_id, regency, city]);

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (hotel) {
            put(
                route('hotel.base-hotel.update', {
                    base_hotel: hotel.id,
                }),
                {
                    onSuccess: () => {
                        toast.success('Hotel berhasil diperbarui');
                    },

                    onError: () => {
                        toast.error('Gagal memperbarui hotel.');
                    },
                },
            );
        } else {
            post(route('hotel.base-hotel.store'), {
                onSuccess: () => {
                    toast.success('Hotel berhasil ditambahkan.');
                },

                onError: () => {
                    toast.error('Gagal menambahkan hotel.');
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
                        {hotel ? 'Pembaruan Hotel' : 'Buat Hotel'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {hotel
                            ? 'Perbarui data kategori yang sudah ada.'
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
                                setData('name', name);
                            }}
                            placeholder="Masukkan nama hotel"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="flex columns-4 gap-3">
                        <div>
                            <label
                                htmlFor="province_id"
                                className="mb-1 block text-sm font-medium"
                            >
                                Pilih Provinsi
                            </label>

                            <select
                                id="role_id"
                                name="role_id"
                                value={data.province_id}
                                onChange={(e) => {
                                    const province = Number(e.target.value);

                                    setData({
                                        province_id: province,
                                    });

                                    const regencieData = regency.filter(
                                        function (value) {
                                            if (province == value.province_id) {
                                                return true;
                                            }
                                        },
                                    );

                                    setRegencies(regencieData);
                                    setCities([]);
                                }}
                                className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                            >
                                <option value={0}>Pilih Provinsi</option>

                                {province.map((prov) => (
                                    <option key={prov.id} value={prov.id}>
                                        {prov.name}
                                    </option>
                                ))}
                            </select>

                            {errors.province_id && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.province_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="regency_id"
                                className="mb-1 block text-sm font-medium"
                            >
                                Pilih Kabupaten
                            </label>

                            <select
                                id="role_id"
                                name="role_id"
                                value={data.regency_id}
                                onChange={(e) => {
                                    const regencyData = Number(e.target.value);
                                    setData('regency_id', regencyData);

                                    const cityData = city.filter(
                                        function (value) {
                                            if (
                                                regencyData == value.regency_id
                                            ) {
                                                return true;
                                            }
                                        },
                                    );

                                    setCities(cityData);
                                }}
                                className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                            >
                                <option value={0}>Pilih Kabupaten</option>

                                {regencies.map((regen) => (
                                    <option key={regen.id} value={regen.id}>
                                        {regen.name}
                                    </option>
                                ))}
                            </select>

                            {errors.regency_id && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.regency_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="city_id"
                                className="mb-1 block text-sm font-medium"
                            >
                                Pilih Kota
                            </label>

                            <select
                                id="role_id"
                                name="role_id"
                                value={data.city_id}
                                onChange={(e) => {
                                    const city = Number(e.target.value);
                                    setData('city_id', city);
                                }}
                                className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                            >
                                <option value={0}>Pilih Kabupaten</option>

                                {cities.map((cit) => (
                                    <option key={cit.id} value={cit.id}>
                                        {cit.name}
                                    </option>
                                ))}
                            </select>

                            {errors.regency_id && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.regency_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-1 block text-sm font-medium"
                        >
                            No. Telp
                        </label>

                        <input
                            type="number"
                            id="phone"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => {
                                const phone = Number(e.target.value);
                                setData('phone', phone);
                            }}
                            placeholder="Masukkan Nomor Telepon"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium"
                        >
                            Email
                        </label>

                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => {
                                const email = e.target.value;
                                setData('email', email);
                            }}
                            placeholder="Masukkan Email"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="address"
                            className="mb-1 block text-sm font-medium"
                        >
                            address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={(e) => {
                                const address = e.target.value;
                                setData('address', address);
                            }}
                            placeholder="Masukkan Aalamat"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.address && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    <div className="column-6 flex gap-3">
                        <div>
                            <label
                                htmlFor="latitude"
                                className="mb-1 block text-sm font-medium"
                            >
                                Latitude
                            </label>

                            <input
                                type="number"
                                id="latitude"
                                name="latitude"
                                value={data.latitude}
                                onChange={(e) => {
                                    const latitude = Number(e.target.value);
                                    setData('latitude', latitude);
                                }}
                                placeholder="Masukkan Latitude"
                                className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                            />

                            {errors.latitude && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.latitude}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="longitude"
                                className="mb-1 block text-sm font-medium"
                            >
                                longitude
                            </label>

                            <input
                                type="number"
                                id="longitude"
                                name="longitude"
                                value={data.longitude}
                                onChange={(e) => {
                                    const longitude = Number(e.target.value);
                                    setData('longitude', longitude);
                                }}
                                placeholder="Masukkan Longitude"
                                className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                            />

                            {errors.longitude && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.longitude}
                                </p>
                            )}
                        </div>
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
                        ? hotel
                            ? 'Memperbarui...'
                            : 'Menyimpan...'
                        : hotel
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
