import { useMemo } from 'react';

import type { PostPreview } from '../components/preview/PostPreview';
import type { BuilderFormData } from '../components/builder/BuilderProperties';
import type { PropertyItem } from '../components/builder/BuilderProperties';
import type { TaxonomyItem } from '../components/builder/BuilderTaxonomies';

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

interface UseBuilderPostOptions {
    posts?: TransactionPost[];
    builder?: BuilderMenu[];
    postId?: number | string | null;
    post?: PostPreview | null;
    liveBuilderData?: BuilderFormData;
}

export function useBuilderPost({
    posts = [],
    builder = [],
    postId = null,
    post = null,
    liveBuilderData = {},
}: UseBuilderPostOptions) {
    const currentPost = useMemo(() => {
        return posts.find((item) => String(item.id) === String(postId));
    }, [posts, postId]);

    const currentTranslation = currentPost?.translations?.[0];

    const currentContent = currentTranslation?.content ?? {};

    const currentProperties = currentContent.properties ?? {};

    const currentTaxonomies = currentContent.taxonomies ?? {};

    const allMenuItems = useMemo(() => {
        return builder.flatMap((menu) =>
            flattenMenuItems(menu.menu_item ?? []),
        );
    }, [builder]);

    const currentMenuItem = useMemo(() => {
        if (!currentPost?.menu_item_id) {
            return undefined;
        }

        return allMenuItems.find(
            (item) => String(item.id) === String(currentPost.menu_item_id),
        );
    }, [allMenuItems, currentPost?.menu_item_id]);

    const resolvedProperties = useMemo(() => {
        const result: Record<string, any> = {
            ...currentProperties,
        };

        const menuProperties = currentMenuItem?.item_properties ?? [];

        for (const property of menuProperties) {
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
    }, [currentProperties, currentMenuItem, liveBuilderData]);

    const resolvedTaxonomies = useMemo(() => {
        const result: Record<string, any> = {
            ...currentTaxonomies,
        };

        const menuTaxonomies = currentMenuItem?.item_taxonomies ?? [];

        for (const taxonomy of menuTaxonomies) {
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
    }, [currentTaxonomies, currentMenuItem, liveBuilderData]);

    const resolvedPost = useMemo<PostPreview | null>(() => {
        if (!currentPost) {
            return post ?? null;
        }

        return {
            ...currentPost,
            content: {
                ...currentContent,
                properties: resolvedProperties,
                taxonomies: resolvedTaxonomies,
            },
        } as PostPreview;
    }, [
        currentPost,
        currentContent,
        resolvedProperties,
        resolvedTaxonomies,
        post,
    ]);

    return {
        currentPost,
        currentTranslation,
        currentContent,
        currentProperties,
        currentTaxonomies,
        allMenuItems,
        currentMenuItem,
        resolvedProperties,
        resolvedTaxonomies,
        resolvedPost,
    };
}
