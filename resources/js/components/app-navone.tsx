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
        'flex h-full items-center justify-center text-[#A98263] transition hover:bg-[#FFF1E5] hover:text-[#B66B35]';

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[400px] border-t border-[#EAE2D9] bg-gradient-to-b from-[#FDFBF8] to-[#F7F3EE] shadow-[0_-2px_8px_rgba(100,75,50,0.08)]">
            <div className="relative">
                <div
                    className={`absolute bottom-full left-0 mb-2 w-full transition-all duration-200 ${
                        showNav
                            ? 'visible translate-y-0 opacity-100'
                            : 'invisible translate-y-3 opacity-0'
                    }`}
                >
                    <div className="mx-auto flex max-w-80 items-end justify-center gap-2">
                        {centerMenus.map(({ label, icon: Icon }, index) => (
                            <button
                                key={label}
                                type="button"
                                disabled
                                className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-sm border border-[#EAE2D9] bg-gradient-to-b from-white to-[#F7F3EE] px-2 py-2 text-[#A99B8D] opacity-60 shadow-[0_2px_6px_rgba(100,75,50,0.10)] ${
                                    index === 1 ? '-translate-y-3' : ''
                                }`}
                            >
                                <Icon className="size-5" />
                                <span className="mt-1 text-[10px] font-medium">
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid h-14 grid-cols-3 items-center">
                    <Link
                        href="beranda"
                        className={navLink}
                        aria-label="Beranda"
                    >
                        <Home className="size-5" />
                    </Link>

                    <button
                        type="button"
                        onClick={() => setShowNav(!showNav)}
                        className={`mx-auto flex size-10 items-center justify-center rounded-full border shadow-sm transition ${
                            showNav
                                ? 'border-[#E8C3A3] bg-gradient-to-b from-[#FFF8F0] to-[#FFF1E5] text-[#B66B35]'
                                : 'border-[#EAE2D9] bg-gradient-to-b from-white to-[#F7F3EE] text-[#C4773D] hover:to-[#F5E9DC]'
                        }`}
                        aria-label={showNav ? 'Tutup menu' : 'Buka menu'}
                        aria-expanded={showNav}
                    >
                        {showNav ? (
                            <X className="size-5" />
                        ) : (
                            <Menu className="size-5" />
                        )}
                    </button>

                    <Link
                        href="notifikasi"
                        className={navLink}
                        aria-label="Notifikasi"
                    >
                        <Bell className="size-5" />
                    </Link>
                </div>
            </div>
        </nav>
    );
}
