import * as LucideIcons from 'lucide-react';
import type { NavItem } from '../../../../resources/js/types';

export const hotelNavGroups = (): {
    title: string;
    items: NavItem[];
}[] => [
    {
        title: '',
        items: [
            {
                title: 'Dashboard',
                href: '/hotel/dashboard',
                url: '/hotel/dashboard',
                icon: LucideIcons.LayoutDashboard,
            } as NavItem,
        ],
    },
    {
        title: 'Hotel',
        items: [
            {
                title: 'Base',
                href: '/hotel/base-hotel',
                url: '/hotel/base-hotel',
                icon: LucideIcons.Building2,
            } as NavItem,
            {
                title: 'Bangunan',
                href: '/hotel/building',
                url: '/hotel/building',
                icon: LucideIcons.Building,
            } as NavItem,
            {
                title: 'Lantai',
                href: '/hotel/floor',
                url: '/hotel/floor',
                icon: LucideIcons.ArrowDown01,
            } as NavItem,
        ],
    },
    {
        title: 'Company',
        items: [
            {
                title: 'Department',
                href: '/company/department',
                url: '/company/department',
                icon: LucideIcons.BriefcaseBusiness,
            } as NavItem,
            {
                title: 'Staff',
                href: '/company/staff',
                url: '/company/staff',
                icon: LucideIcons.User2,
            } as NavItem,
        ],
    },
    {
        title: 'Amenites & Room',
        items: [
            {
                title: 'Amenities',
                href: '/amenities-room/amenities',
                url: '/amenities-room/amenities',
                icon: LucideIcons.BaggageClaim,
            } as NavItem,
        ],
    },
];
