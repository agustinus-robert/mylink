import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface Props {
    role?: Role;
    onClose: () => void;
}

interface FormData {
    name: string;
}

export default function RoleForm({ role, onClose }: Props) {
    const { data, setData, post, put, processing, errors } =
        useForm<FormData>({
            name: role?.name ?? '',
        });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                toast.success(
                    role
                        ? 'Role berhasil diperbarui.'
                        : 'Role berhasil ditambahkan.',
                );

                onClose();
            },
            onError: () => {
                toast.error(
                    role
                        ? 'Gagal memperbarui role.'
                        : 'Gagal menambahkan role.',
                );
            },
        };

        if (role) {
            put(
                route('account.role.update', {
                    role: role.id,
                }),
                options,
            );
        } else {
            post(route('account.role.store'), options);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset disabled={processing}>
                <div className="border-b border-slate-800 px-6 py-4">
                    <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-100">
                        <ListTree />
                        {role ? 'Edit Role' : 'Tambah Role'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {role
                            ? 'Perbarui data role yang sudah ada.'
                            : 'Tambahkan role baru ke dalam sistem.'}
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
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                            placeholder="Masukkan nama role"
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
                    onClick={onClose}
                    disabled={processing}
                    className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Batal
                </button>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing
                        ? role
                            ? 'Memperbarui...'
                            : 'Menyimpan...'
                        : role
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
