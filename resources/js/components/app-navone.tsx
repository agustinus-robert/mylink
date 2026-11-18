import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { FileText, Home, Menu, X, Bell, ListFilter, Send } from 'lucide-react';

const centerMenus = [
    { label: 'Topik', icon: ListFilter, link: 'javascript:void(0)' },
    { label: 'Ajukan Barang', icon: Send, link: 'javascript:void(0)' },
    { label: 'Note', icon: FileText, link: 'javascript:void(0)' },
];

export default function NavOne() {
    const [showNav, setShowNav] = useState(false);

    const navLink =
        'flex h-full items-center justify-center text-white transition hover:bg-blue-400 hover:text-sky-100';

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[410px] border-t border-[#DEDAD4] bg-blue-500 from-white shadow-[0_-2px_8px_rgba(40,30,20,0.10)]">
            <div className="relative">
                <div
                    className={`absolute bottom-full left-0 mb-2 w-full transition-all duration-200 ${
                        showNav
                            ? 'visible translate-y-0 opacity-100'
                            : 'invisible translate-y-3 opacity-0'
                    }`}
                >
                    <div className="mx-auto flex max-w-80 items-end justify-center gap-2">
                        {centerMenus.map(
                            ({ label, icon: Icon, link }, index) => (
                                <a
                                    key={label}
                                    href={link}
                                    className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-sm border border-[#DEDAD4] bg-gradient-to-b from-white to-[#F5F4F1] px-2 py-2 text-[#8B8178] opacity-70 shadow-[0_2px_6px_rgba(40,30,20,0.10)] ${
                                        index === 1 ? '-translate-y-3' : ''
                                    }`}
                                >
                                    <Icon className="size-5" />
                                    <span className="mt-1 text-[10px] font-semibold">
                                        {label}
                                    </span>
                                </a>
                            ),
                        )}
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
                                ? 'border-blue-400 bg-blue-400 text-white'
                                : 'border-white bg-sky-100 text-blue-700 hover:bg-blue-100 hover:text-blue-700'
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
