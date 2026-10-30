import React from 'react';
import { Head } from '@inertiajs/react';

interface DashboardProps {
    user?: {
        name: string;
        email: string;
    };
}

export default function Dashboard({ user }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard Portal" />

            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Dashboard Portal UMKM
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Selamat datang kembali
                            {user?.name ? `, ${user.name}` : ''}!
                        </p>
                    </div>
                </div>

                {/* Card Ringkasan Dummy */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            Total UMKM
                        </span>
                        <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                            128
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            Permohonan Aktif
                        </span>
                        <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                            12
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            Terverifikasi
                        </span>
                        <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                            116
                        </div>
                    </div>
                </div>

                {/* Area Konten Utama */}
                <div className="mt-4 min-h-[300px] rounded-xl border border-dashed border-slate-300 p-6 dark:border-slate-800">
                    <p className="text-center text-sm text-slate-500">
                        Halaman ini dirender dari modul{' '}
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800">
                            Portal
                        </code>
                        .
                    </p>
                </div>
            </div>
        </>
    );
}
