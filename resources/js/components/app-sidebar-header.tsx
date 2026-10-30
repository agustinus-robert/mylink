import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import {
    LayoutDashboard,
    Home,
    Users,
    Settings,
    FileText,
    BarChart3,
    Bell,
    X,
    Share2,
    Rss,
    Globe,
    LayoutTemplate,
    Building,
} from 'lucide-react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [open, setOpen] = useState(false);

    const menus = [
        {
            label: 'Home',
            icon: Home,
            href: '/dashboard',
        },
        {
            label: 'Users',
            icon: Users,
            href: '/',
        },
        {
            label: 'Hotel',
            icon: Building,
            href: '/hotel/dashboard',
        },
        {
            label: 'Forum',
            icon: Share2,
            href: '/',
        },
        {
            label: 'Page Builder',
            icon: LayoutTemplate,
            href: '/pagebuilder/init',
        },
        {
            label: 'CMS',
            icon: Rss,
            href: '/cms/dashboard',
        },
        {
            label: 'Posts',
            icon: FileText,
            href: '/',
        },

        {
            label: 'Reports',
            icon: BarChart3,
            href: '/',
        },
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/',
        },
    ];

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center gap-2">
                <SidebarTrigger className="-ml-1" />

                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-md bg-black/10 px-3 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:bg-black/20 hover:text-foreground dark:bg-white/5 dark:hover:bg-white/10"
                >
                    <Globe className="h-5 w-5" />
                    <span>Ke Beranda</span>
                </Link>

                {/* <div className="relative ml-auto">
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                        {open ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <LayoutDashboard className="h-5 w-5" />
                        )}
                    </button>

                    {open && (
                        <div className="absolute top-11 right-0 z-50 w-72 rounded-xl border bg-popover p-3 shadow-lg">
                            <div className="grid grid-cols-3 gap-2">
                                {menus.map((menu) => {
                                    const Icon = menu.icon;

                                    return (
                                        <Link
                                            key={menu.label}
                                            href={menu.href}
                                            onClick={() => setOpen(false)}
                                            className="flex h-20 flex-col items-center justify-center gap-2 rounded-lg text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <Icon className="h-5 w-5" />

                                            <span className="text-xs">
                                                {menu.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div> */}
            </div>
        </header>
    );
}
