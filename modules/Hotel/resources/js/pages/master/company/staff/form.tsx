import dayjs from 'dayjs';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';
import { PropsForm, StaffFormData } from './types';

export default function DepartmentData({ staff, hotel, user }: PropsForm) {
    const { data, setData, post, put, processing, errors } =
        useForm<StaffFormData>({
            hotel_id: staff?.hotel_id ?? 0,
            user_id: staff?.user_id ?? 0,
            start_at: dayjs(staff?.start_at).format('YYYY-MM-DD') ?? '',
            end_at: dayjs(staff?.end_at).format('YYYY-MM-DD') ?? '',
        });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (staff) {
            put(
                route('company.staff.update', {
                    staff: staff.id,
                }),
                {
                    onSuccess: () => {
                        toast.success('Staff Hotel berhasil diperbarui');
                    },

                    onError: () => {
                        toast.error('Gagal memperbarui staff hotel.');
                    },
                },
            );
        } else {
            post(route('company.staff.store'), {
                onSuccess: () => {
                    toast.success('Staff Hotel berhasil ditambahkan.');
                },

                onError: () => {
                    toast.error('Staff Hotel gagal ditambahkan.');
                },
            });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset disabled={processing}>
                {/* Header */}
                <div className="border-b border-slate-800 px-6 py-4">
                    <h2 className="flex gap-3 text-lg font-semibold text-slate-100">
                        <ListTree />

                        {staff ? 'Pembaruan Staff' : 'Buat Staff'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {staff
                            ? 'Perbarui Staff Hotel yang sudah ada.'
                            : 'Tambahkan Staff Hotel baru ke dalam sistem.'}
                    </p>
                </div>

                <div className="space-y-4 p-6">
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
                                setData('hotel_id', Number(e.target.value));
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

                <div className="space-y-4 p-6">
                    <div>
                        <label
                            htmlFor="user_id"
                            className="mb-1 block text-sm font-medium"
                        >
                            Pilih User
                        </label>

                        <select
                            id="user_id"
                            name="user_id"
                            value={data.user_id}
                            onChange={(e) => {
                                setData('user_id', Number(e.target.value));
                            }}
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        >
                            <option value={0}>Pilih User</option>

                            {user?.map((usr) => (
                                <option key={usr.id} value={usr.id}>
                                    {usr.name}
                                </option>
                            ))}
                        </select>

                        {errors.user_id && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.user_id}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-4 p-6">
                    <div>
                        <label
                            htmlFor="start_at"
                            className="mb-1 block text-sm font-medium"
                        >
                            Tanggal awal berlaku
                        </label>

                        <input
                            id="start_at"
                            type="date"
                            name="start_at"
                            value={data.start_at}
                            onChange={(e) => {
                                setData('start_at', e.target.value);
                            }}
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.start_at && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.start_at}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-4 p-6">
                    <div>
                        <label
                            htmlFor="end_at"
                            className="mb-1 block text-sm font-medium"
                        >
                            Tanggal akhir berlaku
                        </label>

                        <input
                            id="start_at"
                            type="date"
                            name="end_at"
                            value={data.end_at}
                            onChange={(e) => {
                                setData('end_at', e.target.value);
                            }}
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.end_at && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.end_at}
                            </p>
                        )}
                    </div>
                </div>
            </fieldset>

            {/* Actions */}
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
                        ? staff
                            ? 'Memperbarui...'
                            : 'Menyimpan...'
                        : staff
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
