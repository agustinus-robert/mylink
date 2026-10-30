import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import { ListTree } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
}

interface Role {
    id: number;
    name: string;
}

interface Props {
    roles: Role[];
    user?: User;
    onClose: () => void;
}

interface FormData {
    role_id: number;
    name: string;
    email: string;
    password: string;
    retype_password: string;
}

export default function UserForm({
    roles,
    user,
    onClose,
}: Props) {
    const { data, setData, post, put, processing, errors } =
        useForm<FormData>({
            role_id: user?.role_id ?? 0,
            name: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
            retype_password: '',
        });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (data.password !== data.retype_password) {
            toast.error('Kata sandi tidak sama.');
            return;
        }

        const options = {
            onSuccess: () => {
                toast.success(
                    user
                        ? 'Pengguna berhasil diperbarui.'
                        : 'Pengguna berhasil ditambahkan.',
                );

                onClose();
            },
            onError: () => {
                toast.error(
                    user
                        ? 'Gagal memperbarui pengguna.'
                        : 'Gagal menambahkan pengguna.',
                );
            },
        };

        if (user) {
            put(
                route('account.user.update', {
                    user: user.id,
                }),
                options,
            );
        } else {
            post(route('account.user.store'), options);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <fieldset disabled={processing}>
                <div className="border-b border-slate-800 px-6 py-4">
                    <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-100">
                        <ListTree />
                        {user ? 'Edit Pengguna' : 'Tambah Pengguna'}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        {user
                            ? 'Perbarui data pengguna yang sudah ada.'
                            : 'Tambahkan pengguna baru ke dalam sistem.'}
                    </p>
                </div>

                <div className="space-y-4 p-6">
                    <div>
                        <label
                            htmlFor="role_id"
                            className="mb-1 block text-sm font-medium"
                        >
                            Role
                        </label>

                        <select
                            id="role_id"
                            name="role_id"
                            value={data.role_id || ''}
                            onChange={(e) =>
                                setData('role_id', Number(e.target.value))
                            }
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        >
                            <option value="">Pilih Role</option>

                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>

                        {errors.role_id && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.role_id}
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
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                            placeholder="Masukkan nama pengguna"
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
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium"
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={(e) =>
                                setData('email', e.target.value)
                            }
                            placeholder="Masukkan email pengguna"
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
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium"
                        >
                            Kata Sandi
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder={
                                user
                                    ? 'Kosongkan jika tidak ingin mengubah'
                                    : 'Masukkan kata sandi'
                            }
                            autoComplete="new-password"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="retype_password"
                            className="mb-1 block text-sm font-medium"
                        >
                            Ulangi Kata Sandi
                        </label>

                        <input
                            type="password"
                            id="retype_password"
                            name="retype_password"
                            value={data.retype_password}
                            onChange={(e) =>
                                setData('retype_password', e.target.value)
                            }
                            placeholder="Ulangi kata sandi"
                            autoComplete="new-password"
                            className="w-full rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary"
                        />

                        {data.retype_password &&
                            data.password !== data.retype_password && (
                                <p className="mt-1 text-sm text-red-400">
                                    Kata sandi tidak sama.
                                </p>
                            )}

                        {errors.retype_password && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.retype_password}
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
                        ? user
                            ? 'Memperbarui...'
                            : 'Menyimpan...'
                        : user
                          ? 'Perbarui'
                          : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
