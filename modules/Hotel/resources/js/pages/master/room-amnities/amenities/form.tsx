import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';
import { AmenitiesForm, AmenitiesFormData } from './types';
import { useState, useEffect } from 'react';
import { menuIcons } from '../../../../../../../../resources/js/config/menu-icons';

export default function BuildingData({ amenities, statuses }: AmenitiesForm) {
    const [iconSearch, setIconSearch] = useState('');
    const [showIcons, setShowIcons] = useState(false);

    const filteredIcons = menuIcons.filter((item) =>
        item.name.toLowerCase().includes(iconSearch.toLowerCase()),
    );
    const { data, setData, post, put, processing, errors } =
        useForm<AmenitiesFormData>({
            name: amenities?.name ?? '',
            status: amenities?.status ?? 0,
            icon: amenities?.icon ?? '',
        });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (amenities) {
            put(
                route('amenities-room.amenities.update', {
                    amenity: amenities.id,
                }),
                {
                    onSuccess: () => {
                        toast.success('Amenities berhasil diperbarui');
                    },

                    onError: () => {
                        toast.error('Gagal memperbarui amenities.');
                    },
                },
            );
        } else {
            post(route('amenities-room.amenities.store'), {
                onSuccess: () => {
                    toast.success('Amenities berhasil ditambahkan.');
                },

                onError: () => {
                    toast.error('Amenities gagal ditambahkan.');
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
                        {amenities ? 'Pembaruan amenities' : 'Buat amenities'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {amenities
                            ? 'Perbarui amenities yang sudah ada.'
                            : 'Tambahkan amenities baru ke dalam sistem.'}
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
                            placeholder="Masukkan nama bangunan"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <label
                            htmlFor="icon"
                            className="mb-2 block text-sm font-medium"
                        >
                            Icon
                        </label>

                        <input
                            type="text"
                            id="icon"
                            name="icon"
                            value={iconSearch || data.icon}
                            onChange={(e) => {
                                const value = e.target.value;

                                setIconSearch(value);
                                setData('icon', value);
                                setShowIcons(true);
                            }}
                            onFocus={() => {
                                if (iconSearch) {
                                    setShowIcons(true);
                                }
                            }}
                            placeholder="Ketik nama icon..."
                            autoComplete="off"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {showIcons && iconSearch && (
                            <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-slate-700 bg-background p-2 shadow-lg">
                                {filteredIcons.length > 0 ? (
                                    <div className="grid grid-cols-6 gap-2">
                                        {filteredIcons.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <button
                                                    key={item.name}
                                                    type="button"
                                                    title={item.label}
                                                    onClick={() => {
                                                        setData(
                                                            'icon',
                                                            item.name,
                                                        );
                                                        setIconSearch(
                                                            item.name,
                                                        );
                                                        setShowIcons(false);
                                                    }}
                                                    className="flex h-12 items-center justify-center rounded-md border border-slate-700 hover:bg-slate-800"
                                                >
                                                    <Icon size={20} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="p-3 text-sm text-slate-400">
                                        Icon tidak ditemukan.
                                    </p>
                                )}
                            </div>
                        )}

                        {errors.icon && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.icon}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <div>
                            <label
                                htmlFor="status"
                                className="mb-1 block text-sm font-medium"
                            >
                                Pilih Status
                            </label>

                            <select
                                id="role_id"
                                name="role_id"
                                value={data.status}
                                onChange={(e) => {
                                    const status = Number(e.target.value);

                                    setData({
                                        status: status,
                                    });
                                }}
                                className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                            >
                                <option value={0}>Pilih Status</option>

                                {statuses?.map((sst) => (
                                    <option key={sst.id} value={sst.id}>
                                        {sst.name}
                                    </option>
                                ))}
                            </select>

                            {errors.status && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.status}
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
                        ? amenities
                            ? 'Memperbarui...'
                            : 'Menyimpan...'
                        : amenities
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
