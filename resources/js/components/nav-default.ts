import {
    LayoutGrid,
    ListTree,
    ListStartIcon,
    Settings,
    Shield,
    User,
    Tag,
    Tags,
    Menu,
    MenuSquare,
    Logs,
    ListCheck,
    Languages,
    PackagePlus
} from 'lucide-react';

import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export const mainNavGroups: NavGroup[] = [
    {
        title: '',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ],
    },

    {
        title: 'Transaction',
        items: [
            {
                title: 'Barang Masuk',
                href: '/transaction/incoming',
                icon: PackagePlus,
            }
        ],
    },

    {
        title: 'Master',
        items: [
            {
                title: 'Kategori',
                href: '/master/category',
                icon: ListTree,
            },
            {
                title: 'Sub Kategori',
                href: '/master/sub-category',
                icon: ListStartIcon,
            },
        ],
    },

    {
        title: 'Manajemen User',
        items: [
            {
                title: 'User',
                href: '/account/user',
                icon: User,
            },
            {
                title: 'Role',
                href: '/account/role',
                icon: Settings,
            },
            // {
            //     title: 'Permission',
            //     href: '/account/permission',
            //     icon: Shield,
            // },
        ],
    },
];
