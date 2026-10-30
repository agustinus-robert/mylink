import { Head } from '@inertiajs/react';
import { ShieldCheck, Settings } from 'lucide-react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            {' '}
            <Head title="Dashboard" />
            <div className="flex min-h-full flex-1 flex-col p-4 sm:p-6 lg:p-8">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-2xl rounded-2xl border border-sidebar-border bg-background p-8 text-center shadow-sm sm:p-12">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <ShieldCheck className="h-8 w-8" />
                        </div>

                        <p className="mb-3 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                            Admin Panel
                        </p>

                        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                            Selamat Datang!
                        </h1>

                        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                            Selamat datang di panel pengelolaan admin. Kelola
                            pengguna dan data sistem dengan mudah melalui menu
                            navigasi yang tersedia.
                        </p>

                        <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-sidebar-border px-4 py-2 text-sm text-muted-foreground">
                            <Settings className="h-4 w-4" />
                            <span>Sistem Pengelolaan Admin</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
