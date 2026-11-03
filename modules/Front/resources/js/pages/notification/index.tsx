import { Bell, Plus, Pencil, Trash2, Clock } from 'lucide-react';

export default function Notification() {
    const notifications = [
        {
            type: 'insert',
            title: 'Data barang berhasil ditambahkan',
            description: 'CPU Intel Core i5 Gen 12 telah ditambahkan.',
            time: '10 menit lalu',
        },
        {
            type: 'update',
            title: 'Data barang diperbarui',
            description: 'Informasi RAM DDR4 telah diperbarui.',
            time: '30 menit lalu',
        },
        {
            type: 'delete',
            title: 'Data barang dihapus',
            description: 'Monitor Samsung 24 inch telah dihapus.',
            time: '1 jam lalu',
        },
        {
            type: 'insert',
            title: 'Permintaan barang baru',
            description: 'Pengguna mengajukan permintaan CPU daerah Solo.',
            time: '3 jam lalu',
        },
        {
            type: 'update',
            title: 'Profil diperbarui',
            description: 'Informasi profil akun berhasil diperbarui.',
            time: 'Kemarin',
        },
        {
            type: 'delete',
            title: 'Data kategori dihapus',
            description: 'Kategori Aksesoris telah dihapus.',
            time: 'Kemarin',
        },
    ];

    const styles = {
        insert: {
            icon: Plus,
            color: 'bg-emerald-50 text-emerald-600',
            label: 'Insert',
        },
        update: {
            icon: Pencil,
            color: 'bg-sky-50 text-sky-600',
            label: 'Update',
        },
        delete: {
            icon: Trash2,
            color: 'bg-red-50 text-red-600',
            label: 'Delete',
        },
    };

    return (
        <div className="m-2 w-full max-w-100 rounded-xl border border-gray-200 bg-white p-3">
            <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-sky-50">
                    <Bell className="size-5 text-sky-600" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                        Notifikasi
                    </h3>
                    <p className="text-xs text-gray-400">
                        Riwayat aktivitas terbaru
                    </p>
                </div>
            </div>

            <div className="flex flex-col">
                {notifications.map((item, index) => {
                    const style = styles[item.type as keyof typeof styles];
                    const Icon = style.icon;

                    return (
                        <div
                            key={index}
                            className="flex items-start gap-3 border-b border-gray-100 py-3 last:border-0"
                        >
                            <div
                                className={`flex size-9 shrink-0 items-center justify-center rounded-full ${style.color}`}
                            >
                                <Icon className="size-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-800">
                                        {item.title}
                                    </p>
                                </div>

                                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                    {item.description}
                                </p>

                                <span className="mt-2 inline-block rounded bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-500">
                                    {style.label}
                                </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-1 text-[10px] text-gray-400">
                                <Clock className="size-3" />
                                {item.time}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
