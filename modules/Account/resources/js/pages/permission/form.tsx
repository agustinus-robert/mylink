import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    permission?: Permission;
}

interface FormData {
    name: string;
    slug: string;
}

export default function PermissionForm({ permission }: Props) {
    const { data, setData, post, put, processing, errors } = useForm<FormData>({
        name: permission?.name ?? '',
        slug: permission?.slug ?? '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (permission) {
            put(
                route('account.permission.update', {
                    permission: permission.id,
                }),
                {
                    onSuccess: () => {
                        toast.success('Permission berhasil masuk');
                    },

                    onError: () => {
                        toast.error('Gagal memperbarui permission.');
                    },
                },
            );
        } else {
            post(route('account.permission.store'), {
                onSuccess: () => {
                    toast.success('Permission berhasil ditambahkan.');
                },

                onError: () => {
                    toast.error('Gagal menambahkan permission.');
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
                        {permission
                            ? 'Pembaruan Permission'
                            : 'Buat Permission'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {permission
                            ? 'Perbarui data permission yang sudah ada.'
                            : 'Tambahkan permission baru ke dalam sistem.'}
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

                                setData({
                                    name,
                                });
                            }}
                            placeholder="Masukkan nama permission"
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
                        ? permission
                            ? 'Memperbarui...'
                            : 'Menyimpan...'
                        : permission
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
