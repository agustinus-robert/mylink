import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';
import { PropsForm, DepartmentFormData, Hotel } from './types';
import { useState, useEffect } from 'react';

export default function DepartmentData({ hotel, department }: PropsForm) {
    const [hotels, setHotel] = useState<Hotel[]>([]);
    const { data, setData, post, put, processing, errors } =
        useForm<DepartmentFormData>({
            hotel_id: department?.hotel_id ?? 0,
            name: department?.name ?? '',
        });

    useEffect(() => {
        if (!data.hotel_id) {
            return;
        }

        const hotelData =
            hotel?.filter((value) => value.id === data.hotel_id) ?? [];

        setHotel(hotelData);
    }, [data.hotel_id, hotel]);

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (department) {
            put(
                route('company.department.update', {
                    department: department.id,
                }),
                {
                    onSuccess: () => {
                        toast.success('Department Hotel berhasil diperbarui');
                    },

                    onError: () => {
                        toast.error('Gagal memperbarui department hotel.');
                    },
                },
            );
        } else {
            post(route('company.department.store'), {
                onSuccess: () => {
                    toast.success('Department Hotel berhasil ditambahkan.');
                },

                onError: () => {
                    toast.error('Department Hotel Gagal ditambahkan.');
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
                        {department
                            ? 'Pembaruan Department'
                            : 'Buat Department'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {department
                            ? 'Perbarui Department Hotel yang sudah ada.'
                            : 'Tambahkan Department Hotel baru ke dalam sistem.'}
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
                                id="role_id"
                                name="role_id"
                                value={data.hotel_id}
                                onChange={(e) => {
                                    const hotel = Number(e.target.value);

                                    setData({
                                        hotel_id: hotel,
                                    });
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
                            placeholder="Masukkan Nama Department"
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
                        ? department
                            ? 'Memperbarui...'
                            : 'Menyimpan...'
                        : department
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
