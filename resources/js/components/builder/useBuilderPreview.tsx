import { useCallback, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';

import type { PostPreview } from '../preview/PostPreview';

import { createPostPreviewData } from '../preview/PostPreview';

import type { BuilderFormData } from './BuilderProperties';

import {
    flattenMenuItems,
    resolveProperties,
    resolveTaxonomies,
    sameData,
} from './frontUtils';

import type { BuilderPageProps } from './frontUtils';

export default function useBuilderPreview(postId?: number | string | null) {
    const page = usePage<BuilderPageProps>();

    const posts = page.props.posts ?? [];
    const builder = page.props.builder ?? [];

    const [liveBuilderData, setLiveBuilderData] = useState<BuilderFormData>({});

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
        return resolveProperties(
            currentProperties,
            currentMenuItem,
            liveBuilderData,
        );
    }, [currentProperties, currentMenuItem, liveBuilderData]);

    const resolvedTaxonomies = useMemo(() => {
        return resolveTaxonomies(
            currentTaxonomies,
            currentMenuItem,
            liveBuilderData,
        );
    }, [currentTaxonomies, currentMenuItem, liveBuilderData]);

    const resolvedPost = useMemo<PostPreview | null>(() => {
        if (!currentPost) {
            return null;
        }

        return {
            ...currentPost,
            content: {
                ...currentContent,
                properties: resolvedProperties,
                taxonomies: resolvedTaxonomies,
            },
        } as PostPreview;
    }, [currentPost, currentContent, resolvedProperties, resolvedTaxonomies]);

    const previewData = useMemo(() => {
        return createPostPreviewData(resolvedPost, Number(postId));
    }, [resolvedPost, postId]);

    const handlePreviewChange = useCallback(
        (id: number | string, formData: BuilderFormData) => {
            if (String(id) !== String(postId)) {
                return;
            }

            setLiveBuilderData((previous) => {
                if (sameData(previous, formData)) {
                    return previous;
                }

                return {
                    ...formData,
                };
            });
        },
        [postId],
    );

    return {
        page,
        posts,
        builder,
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
        previewData,
        liveBuilderData,
        setLiveBuilderData,
        handlePreviewChange,
    };
}
