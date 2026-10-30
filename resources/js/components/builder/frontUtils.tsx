import type { PropertyItem, BuilderFormData } from './BuilderProperties';

import type { TaxonomyItem } from './BuilderTaxonomies';

export interface PostTranslation {
    id: number;
    post_id: number;
    language_id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content?: Record<string, any> | null;
}

export interface TransactionPost {
    id: number;
    menu_item_id?: number | null;
    is_published?: boolean;
    published_at?: string | null;
    translations?: PostTranslation[];
}

export interface BuilderMenuItem {
    id: number;
    menu_id: number;
    parent_id?: number | null;
    type?: number | string;
    behavior?: number;
    label: string;
    sort_order?: number;
    link?: string | null;
    item_properties?: PropertyItem[];
    item_taxonomies?: TaxonomyItem[];
    children_recursive?: BuilderMenuItem[];
}

export interface BuilderMenu {
    id: number;
    name: string;
    menu_item?: BuilderMenuItem[];
}

export interface BuilderPageProps {
    [key: string]: any;
    builder?: BuilderMenu[];
    posts?: TransactionPost[];
}

export function flattenMenuItems(items: BuilderMenuItem[]): BuilderMenuItem[] {
    const result: BuilderMenuItem[] = [];

    for (const item of items) {
        result.push(item);

        if (item.children_recursive?.length) {
            result.push(...flattenMenuItems(item.children_recursive));
        }
    }

    return result;
}

export function sameData(
    first: BuilderFormData,
    second: BuilderFormData,
): boolean {
    try {
        return JSON.stringify(first) === JSON.stringify(second);
    } catch {
        return false;
    }
}

export function resolveProperties(
    currentProperties: Record<string, any>,
    currentMenuItem?: BuilderMenuItem,
    liveBuilderData: BuilderFormData = {},
): Record<string, any> {
    const result: Record<string, any> = {
        ...currentProperties,
    };

    for (const property of currentMenuItem?.item_properties ?? []) {
        const key = String(property.id);

        if (!(key in result)) {
            result[key] = property.value ?? '';
        }
    }

    for (const key of Object.keys(liveBuilderData)) {
        if (!key.startsWith('prop_')) {
            continue;
        }

        const propertyId = key.replace('prop_', '');

        result[propertyId] = liveBuilderData[key];
    }

    return result;
}

export function resolveTaxonomies(
    currentTaxonomies: Record<string, any>,
    currentMenuItem?: BuilderMenuItem,
    liveBuilderData: BuilderFormData = {},
): Record<string, any> {
    const result: Record<string, any> = {
        ...currentTaxonomies,
    };

    for (const taxonomy of currentMenuItem?.item_taxonomies ?? []) {
        const key = String(taxonomy.id);

        if (!(key in result)) {
            result[key] = taxonomy.modelable_id ?? null;
        }
    }

    for (const key of Object.keys(liveBuilderData)) {
        if (!key.startsWith('taxonomy_')) {
            continue;
        }

        const taxonomyId = key.replace('taxonomy_', '');

        result[taxonomyId] = liveBuilderData[key];
    }

    return result;
}
