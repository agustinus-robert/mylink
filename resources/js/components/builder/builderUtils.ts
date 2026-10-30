import type { GeneralTranslation } from './BuilderGeneralProperties';

export interface PostTranslation {
    id?: number;
    post_id?: number;
    language_id: number;
    title?: string | null;
    slug?: string | null;
    excerpt?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;

    content?: {
        properties?: Record<string, unknown>;
        taxonomies?: Record<string, unknown>;
        images?: Record<string, unknown>;
    } | null;
}

export interface TransactionPost {
    id: number;
    menu_item_id?: number | null;
    is_published?: boolean;
    published_at?: string | null;
    translations?: PostTranslation[];
    content?: {
        properties?: Record<string, unknown>;
        taxonomies?: Record<string, unknown>;
        images?: Record<string, unknown>;
    } | null;
}

export type PayloadPrimitive = string | number | boolean | null;

export type PayloadValue = PayloadPrimitive | PayloadObject | PayloadValue[];

export interface PayloadObject {
    [key: string]: PayloadValue;
}

export function normalizeTranslations(
    translations?: PostTranslation[],
): GeneralTranslation[] {
    return (translations ?? []).map((translation) => ({
        id: translation.id ?? 0,
        language_id: translation.language_id,
        title: translation.title ?? '',
        slug: translation.slug ?? '',
        excerpt: translation.excerpt ?? '',
        seo_title: translation.seo_title ?? '',
        seo_description: translation.seo_description ?? '',
    }));
}

export function normalizeValue(value: unknown): PayloadValue {
    if (
        value === null ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    ) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map(normalizeValue);
    }

    if (typeof value === 'object') {
        const result: PayloadObject = {};

        Object.entries(value as Record<string, unknown>).forEach(
            ([key, item]) => {
                result[key] = normalizeValue(item);
            },
        );

        return result;
    }

    return String(value);
}

export function normalizeContent(content: TransactionPost['content']) {
    if (!content || typeof content !== 'object') {
        return {
            properties: {},
            taxonomies: {},
            images: {},
        };
    }

    return {
        properties:
            content.properties &&
            typeof content.properties === 'object' &&
            !Array.isArray(content.properties)
                ? content.properties
                : {},

        taxonomies:
            content.taxonomies &&
            typeof content.taxonomies === 'object' &&
            !Array.isArray(content.taxonomies)
                ? content.taxonomies
                : {},

        images:
            content.images &&
            typeof content.images === 'object' &&
            !Array.isArray(content.images)
                ? content.images
                : {},
    };
}

export function normalizeTaxonomyValue(
    value: unknown,
    chooserType: number,
): string | number | number[] | null {
    if (chooserType === 2) {
        if (Array.isArray(value)) {
            return value.map(Number).filter(Number.isFinite);
        }

        if (value === null || value === undefined || value === '') {
            return [];
        }

        if (typeof value === 'string') {
            try {
                const parsed: unknown = JSON.parse(value);

                if (Array.isArray(parsed)) {
                    return parsed.map(Number).filter(Number.isFinite);
                }

                const number = Number(parsed);

                return Number.isFinite(number) ? [number] : [];
            } catch {
                const number = Number(value);

                return Number.isFinite(number) ? [number] : [];
            }
        }

        const number = Number(value);

        return Number.isFinite(number) ? [number] : [];
    }

    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return null;
        }

        const number = Number(value[0]);

        return Number.isFinite(number) ? number : null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
}
