import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const listeners = new Set<() => void>();

let currentAppearance: Appearance = 'system';
let initialized = false;

const mediaQuery =
    typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

const prefersDark = (): boolean => mediaQuery?.matches ?? false;

const getStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') {
        return 'system';
    }

    const value = localStorage.getItem('appearance');

    if (value === 'light' || value === 'dark' || value === 'system') {
        return value;
    }

    return 'system';
};

const isDarkMode = (appearance: Appearance): boolean => {
    return appearance === 'dark' || (appearance === 'system' && prefersDark());
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = isDarkMode(appearance);

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const notify = (): void => {
    listeners.forEach((listener) => listener());
};

const handleSystemThemeChange = (): void => {
    if (currentAppearance === 'system') {
        applyTheme(currentAppearance);
        notify();
    }
};

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (!initialized) {
        initialized = true;
        mediaQuery?.addEventListener('change', handleSystemThemeChange);
    }

    currentAppearance = getStoredAppearance();

    localStorage.setItem('appearance', currentAppearance);

    applyTheme(currentAppearance);
}

export function useAppearance(): UseAppearanceReturn {
    const appearance = useSyncExternalStore(
        (callback) => {
            listeners.add(callback);

            return () => {
                listeners.delete(callback);
            };
        },
        () => currentAppearance,
        (): Appearance => 'system',
    );

    const resolvedAppearance: ResolvedAppearance = isDarkMode(appearance)
        ? 'dark'
        : 'light';

    const updateAppearance = (mode: Appearance): void => {
        currentAppearance = mode;

        localStorage.setItem('appearance', mode);

        document.cookie = [
            `appearance=${mode}`,
            'path=/',
            `max-age=${365 * 24 * 60 * 60}`,
            'SameSite=Lax',
        ].join(';');

        applyTheme(mode);
        notify();
    };

    return {
        appearance,
        resolvedAppearance,
        updateAppearance,
    };
}
