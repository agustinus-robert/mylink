import React from 'react';
import { createInertiaApp } from '@inertiajs/react';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { initializeTheme } from '@/hooks/use-appearance';

import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

import NavOne from '@/components/app-navone';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const pages = {
    ...import.meta.glob('./pages/**/*.tsx'),
    ...import.meta.glob('../../modules/**/resources/js/pages/**/*.tsx'),
};

const FrontLayout = ({ children }: { children: React.ReactNode }) => (
    <>
        {children}
        <NavOne />
    </>
);

const frontUrls = [
    '/beranda',
    '/topik',
    '/pengajuan',
    '/catatan',
    '/notifikasi',
];

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: async (name) => {
        let loader = pages[`./pages/${name}.tsx` as keyof typeof pages];

        if (!loader) {
            const parts = name.split('/');
            const module = parts.shift();

            if (module) {
                const moduleName =
                    module.charAt(0).toUpperCase() + module.slice(1);

                const target = `modules/${moduleName}/resources/js/pages/${parts.join('/')}.tsx`;

                const key = Object.keys(pages).find((page) =>
                    page.includes(target),
                );

                if (key) {
                    loader = pages[key as keyof typeof pages];
                }
            }
        }

        if (!loader) {
            throw new Error(`Page not found: ${name}`);
        }

        const page = await loader();

        return (page as { default: React.ComponentType }).default;
    },

    layout: (name) => {
        const currentUrl = window.location.pathname;

        switch (true) {
            case name === 'welcome':
                return null;

            case frontUrls.includes(currentUrl):
                return FrontLayout;

            case name.startsWith('auth/'):
                return AuthLayout;

            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];

            default:
                return AppLayout;
        }
    },

    strictMode: true,

    withApp(app) {
        return (
            <TooltipProvider>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },

    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
