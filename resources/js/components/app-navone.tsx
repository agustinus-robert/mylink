import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    Building2,
    FileText,
    Home,
    Menu,
    X,
    Bell,
    ListFilter,
    ShoppingBasket,
    Send,
} from 'lucide-react';

const centerMenus = [
    { label: 'Topik', icon: ListFilter, link: 'topik' },
    { label: 'Ajukan Barang', icon: Send, link: 'pengajuan' },
    { label: 'Note', icon: FileText, link: 'catatan' },
];

function NavigationCenter({ showNav }: { showNav: boolean }) {
    return (
        <div
            className={`absolute bottom-full left-0 mb-3 w-full transition-all duration-200 ${
                showNav
                    ? 'visible translate-y-0 opacity-100'
                    : 'invisible translate-y-3 opacity-0'
            }`}
        >
            <div className="mx-auto flex max-w-80 items-end justify-center gap-3">
                {centerMenus.map(({ label, icon: Icon }, index) => (
                    <button
                        type="button"
                        disabled
                        key={label}
                        className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl bg-gray-100 px-2 py-3 text-gray-400 opacity-50 shadow-md ${
                            index === 1 ? '-translate-y-4' : ''
                        }`}
                    >
                        <Icon className="size-6" />
                        <span className="mt-1 text-xs font-medium">
                            {label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function NavOne() {
    const [showNav, setShowNav] = useState(false);

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[400px] border-t border-gray-300 bg-white">
            <div className="relative">
                <NavigationCenter showNav={showNav} />

                <div className="grid h-16 grid-cols-3 items-center">
                    <Link
                        href={'beranda'}
                        className="flex h-full items-center justify-center text-gray-700 hover:bg-gray-100"
                        aria-label="Topik"
                    >
                        <Home className="size-6" />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setShowNav((prev) => !prev)}
                        className="mx-auto flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                        aria-label={showNav ? 'Tutup menu' : 'Buka menu'}
                        aria-expanded={showNav}
                    >
                        {showNav ? (
                            <X className="size-6" />
                        ) : (
                            <Menu className="size-6" />
                        )}
                    </button>

                    <Link
                        href={'notifikasi'}
                        className="flex h-full items-center justify-center text-gray-700 hover:bg-gray-100"
                        aria-label="Item"
                    >
                        <Bell className="size-6" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
