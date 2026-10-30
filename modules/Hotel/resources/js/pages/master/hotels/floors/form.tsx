import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';
import { Hotel, Building, FloorForm, FloorFormData } from './types';
import { useState, useEffect } from 'react';

export default function FloorData({ hotel, building, floor }: FloorForm) {
    const [hotels, setHotel] = useState<Hotel[]>([]);
    const [buildings, setBuilding] = useState<Building[]>([]);

    const { data, setData, post, put, processing, errors } =
        useForm<FloorFormData>({
            hotel_id: floor?.hotel_id ?? 0,
            building_id: floor?.building_id ?? 0,
            floor_number: floor?.floor_number ?? 0,
            name: floor?.name ?? '',
            description: floor?.description ?? '',
        });

    useEffect(() => {
        if (!data.hotel_id) {
            return;
        }

        const hotelData =
            hotel?.filter((value) => value.id === data.hotel_id) ?? [];

        setHotel(hotelData);

        if (!data.building_id) {
            return;
        }

        const buildingData =
            building?.filter((value) => value.id === data.building_id) ?? [];

        setBuilding(buildingData);
    }, [data.hotel_id, hotel, data.building_id, building]);

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (floor) {
            put(
                route('hotel.floor.update', {
                    floor: floor.id,
                }),
                {
                    onSuccess: () => {
                        toast.success(
                            'Lantai Bangunan Hotel berhasil diperbarui',
                        );
                    },

                    onError: () => {
                        toast.error('Gagal memperbarui lantai bangunan hotel.');
                    },
                },
            );
        } else {
            post(route('hotel.floor.store'), {
                onSuccess: () => {
                    toast.success(
                        'Lantai Bangunan Hotel berhasil ditambahkan.',
                    );
                },

                onError: () => {
                    toast.error('Lantai Bangunan Hotel Gagal ditambahkan.');
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
                        {floor
                            ? 'Perbarui Lantai Bangunan Hotel'
                            : 'Buat Lantai Bangunan Hotel'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {building
                            ? 'Perbarui Lantai Bangunan Hotel yang sudah ada.'
                            : 'Tambahkan Lantai Bangunan Hotel baru ke dalam sistem.'}
                    </p>
                </div>

                <div className="space-y-4 p-6">
                    <div className="flex gap-3">
                        <div>
                            <label
                                htmlFor="hotel_id"
                                className="mb-1 block text-sm font-medium"
                            >
                                Pilih Hotel
                            </label>

                            <select
                                id="hotel_id"
                                name="hotel_id"
                                value={data.hotel_id}
                                onChange={(e) => {
                                    const hotel = Number(e.target.value);
                                    setData('hotel_id', hotel);

                                    const buildingFilter =
                                        building?.filter(function (value) {
                                            if (value.hotel_id === hotel) {
                                                return true;
                                            }
                                        }) ?? [];

                                    setBuilding(buildingFilter);
                                }}
                                className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                            >
                                <option value={0}>Pilih Hotel</option>

                                {hotel?.map((htl) => (
                                    <option key={htl.id} value={htl.id}>
                                        {htl.name}
                                    </option>
                                ))}
                            </select>

                            {errors.hotel_id && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.hotel_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div>
                            <label
                                htmlFor="building_id"
                                className="mb-1 block text-sm font-medium"
                            >
                                Pilih Bangunan
                            </label>

                            <select
                                id="building_id"
                                name="building_id"
                                value={data.building_id}
                                onChange={(e) => {
                                    const building = Number(e.target.value);
                                    setData('building_id', building);
                                }}
                                className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                            >
                                <option value={0}>Pilih Bangunan</option>

                                {buildings?.map((bld) => (
                                    <option key={bld.id} value={bld.id}>
                                        {bld.name}
                                    </option>
                                ))}
                            </select>

                            {errors.hotel_id && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.hotel_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="floor_number"
                            className="mb-1 block text-sm font-medium"
                        >
                            Nomor Lantai
                        </label>

                        <input
                            type="text"
                            id="floor_number"
                            name="floor_number"
                            value={data.floor_number}
                            onChange={(e) => {
                                const floor_number = Number(e.target.value);
                                setData('floor_number', floor_number);
                            }}
                            placeholder="Masukkan nomor kamar"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.floor_number && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.floor_number}
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
                            value={data.name}
                            onChange={(e) => {
                                const name = e.target.value;
                                setData('name', name);
                            }}
                            placeholder="Masukkan nama bangunan"
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
                            htmlFor="address"
                            className="mb-1 block text-sm font-medium"
                        >
                            Deskripsi
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            value={data.description}
                            onChange={(e) => {
                                const description = e.target.value;
                                setData('description', description);
                            }}
                            placeholder="Masukkan Aalamat"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.description && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.description}
                            </p>
                        )}
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
                        ? floor
                            ? 'Memperbarui...'
                            : 'Menyimpan...'
                        : floor
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
