import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { FileText, Home, Menu, X, Bell, ListFilter, Send } from 'lucide-react';

const centerMenus = [
    { label: 'Topik', icon: ListFilter },
    { label: 'Ajukan Barang', icon: Send },
    { label: 'Note', icon: FileText },
];

export default function NavOne() {
    const [showNav, setShowNav] = useState(false);

    const navLink =
        'flex h-full items-center justify-center text-[#6487a5] transition hover:bg-[#e1edf6] hover:text-[#426f94]';

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[400px] border-t border-[#c9dbea] bg-gradient-to-b from-[#fafdff] to-[#e8f0f7] shadow-[0_-2px_8px_rgba(50,80,110,0.08)]">
            <div className="relative">
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
                                key={label}
                                type="button"
                                disabled
                                className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-sm border border-[#d4e0eb] bg-gradient-to-b from-white to-[#edf3f8] px-2 py-3 text-[#9aabba] opacity-60 shadow-[0_2px_6px_rgba(50,80,110,0.10)] ${
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

                <div className="grid h-16 grid-cols-3 items-center">
                    <Link
                        href="beranda"
                        className={navLink}
                        aria-label="Beranda"
                    >
                        <Home className="size-6" />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setShowNav(!showNav)}
                        className={`mx-auto flex size-12 items-center justify-center rounded-full border shadow-sm transition ${
                            showNav
                                ? 'border-[#e6c99f] bg-gradient-to-b from-[#fff9ef] to-[#f8ead5] text-[#a77a45]'
                                : 'border-[#c9dbea] bg-gradient-to-b from-white to-[#dfebf5] text-[#5286b1] hover:to-[#d5e6f3]'
                        }`}
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
                        href="notifikasi"
                        className={navLink}
                        aria-label="Notifikasi"
                    >
                        <Bell className="size-6" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
