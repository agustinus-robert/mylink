import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';

import type {
    GeneralLanguage,
    GeneralTranslation,
} from './BuilderGeneralProperties';

import type { PropertyItem, BuilderFormData } from './BuilderProperties';

import type { TaxonomyItem } from './BuilderTaxonomies';

import {
    normalizeContent,
    normalizeTaxonomyValue,
    normalizeTranslations,
    normalizeValue,
    type PayloadObject,
    type PayloadValue,
    type TransactionPost,
} from './builderUtils';

interface SharedProps {
    [key: string]: unknown;
    languages?: GeneralLanguage[];
    posts?: TransactionPost[];
}

interface Props {
    isOpen: boolean;
    postId: number | string | null;
    post?: TransactionPost | null;
    properties: PropertyItem[];
    taxonomies: TaxonomyItem[];
    languages: GeneralLanguage[];
    shared: SharedProps;
}

interface BuilderImages {
    desktop: File | string | null;
    tablet: File | string | null;
    mobile: File | string | null;
}

export function useBuilderSidebar({
    isOpen,
    postId,
    post: postProp,
    properties,
    taxonomies,
    languages: propLanguages,
    shared,
}: Props) {
    const [processing, setProcessing] = useState(false);

    const [translations, setTranslations] = useState<GeneralTranslation[]>([]);

    const [builderData, setBuilderData] = useState<BuilderFormData>({});

    const [images, setImages] = useState<BuilderImages>({
        desktop: null,
        tablet: null,
        mobile: null,
    });

    const languages = useMemo(
        () =>
            propLanguages.length
                ? propLanguages
                : Array.isArray(shared.languages)
                  ? shared.languages
                  : [],
        [propLanguages, shared.languages],
    );

    const post = useMemo<TransactionPost | null>(() => {
        if (postProp) {
            return postProp;
        }

        if (postId === null || postId === undefined) {
            return null;
        }

        const foundPost = (shared.posts ?? []).find(
            (item) => Number(item.id) === Number(postId),
        );

        return foundPost ?? null;
    }, [postProp, postId, shared.posts]);

    const content = useMemo(() => {
        if (post?.content) {
            return normalizeContent(post.content);
        }

        const translationContent = post?.translations?.find(
            (translation) => translation.content,
        )?.content;

        return normalizeContent(translationContent);
    }, [post?.content, post?.translations]);

    const preparedTaxonomies = useMemo(
        () =>
            taxonomies.map((item) => ({
                ...item,
                options: Array.isArray(item.options) ? item.options : [],
            })),
        [taxonomies],
    );

    const initialData = useMemo(() => {
        const data: BuilderFormData = {};

        properties.forEach((item) => {
            data[`prop_${item.id}`] = item.value ?? '';
        });

        preparedTaxonomies.forEach((item) => {
            const key = String(item.id);

            const hasPostValue = Object.prototype.hasOwnProperty.call(
                content.taxonomies,
                key,
            );

            const rawValue = hasPostValue
                ? content.taxonomies[key]
                : (item.value ?? null);

            data[`taxonomy_${key}`] = normalizeTaxonomyValue(
                rawValue,
                item.chooser_type,
            );
        });

        return data;
    }, [properties, preparedTaxonomies, content.taxonomies]);

    const makeImageUrl = (value: unknown): File | string | null => {
        if (value instanceof File) {
            return value;
        }

        if (typeof value !== 'string' || !value.trim()) {
            return null;
        }

        const image = value.trim();

        if (
            image.startsWith('http://') ||
            image.startsWith('https://') ||
            image.startsWith('blob:')
        ) {
            return image;
        }

        if (image.startsWith('/storage/posts/images/')) {
            return image;
        }

        if (image.startsWith('storage/posts/images/')) {
            return `/${image}`;
        }

        if (image.startsWith('posts/images/')) {
            return `/storage/${image}`;
        }

        return `/storage/posts/images/${image}`;
    };

    const initialImages = useMemo<BuilderImages>(() => {
        return {
            desktop: makeImageUrl(content.images.desktop),
            tablet: makeImageUrl(content.images.tablet),
            mobile: makeImageUrl(content.images.mobile),
        };
    }, [content.images]);

    useEffect(() => {
        if (!isOpen || postId === null || postId === undefined) {
            return;
        }

        setBuilderData(initialData);
        setImages(initialImages);
        setTranslations(normalizeTranslations(post?.translations));
    }, [isOpen, postId, initialData, initialImages, post?.translations]);

    const setData = <K extends keyof BuilderFormData>(
        key: K,
        value: BuilderFormData[K],
    ) => {
        setBuilderData((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (postId === null || postId === undefined || processing || !post) {
            return;
        }

        if (!translations.length) {
            toast.error('Translation belum tersedia untuk post ini.');
            return;
        }

        const properties: Record<string, unknown> = {
            ...content.properties,
        };

        const taxonomies: Record<string, unknown> = {
            ...content.taxonomies,
        };

        Object.entries(builderData).forEach(([key, value]) => {
            if (key.startsWith('prop_')) {
                properties[key.replace('prop_', '')] = value;
                return;
            }

            if (key.startsWith('taxonomy_')) {
                taxonomies[key.replace('taxonomy_', '')] = value;
            }
        });

        const normalizeRecord = (
            data: Record<string, unknown>,
        ): PayloadObject => {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    normalizeValue(value),
                ]),
            );
        };

        const imagePayload = {
            desktop: images.desktop,
            tablet: images.tablet,
            mobile: images.mobile,
        } as unknown as PayloadValue;

        const payload: PayloadObject = {
            menu_item_id: post.menu_item_id ?? null,
            is_published: post.is_published ?? false,
            published_at: post.published_at ?? null,

            translations: translations.map((item) => ({
                id: item.id || null,
                language_id: item.language_id,
                title: item.title,
                slug: item.slug,
                excerpt: item.excerpt || null,
                seo_title: item.seo_title || null,
                seo_description: item.seo_description || null,
            })),

            content: {
                properties: normalizeRecord(properties),
                taxonomies: normalizeRecord(taxonomies),
                images: imagePayload,
            },
        };

        router.put(
            route('cms.manage-posting.update', {
                manage_posting: postId,
            }),
            payload,
            {
                preserveScroll: true,
                preserveState: true,
                forceFormData: true,

                onStart: () => {
                    setProcessing(true);
                },

                onSuccess: () => {
                    toast.success('Submit berhasil.');
                },

                onError: (errors) => {
                    console.error('Submit error:', errors);

                    const message =
                        Object.values(errors).flat().join(', ') ||
                        'Terjadi kesalahan saat submit.';

                    toast.error(message);
                },

                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return {
        post,
        languages,
        translations,
        setTranslations,
        builderData,
        setData,
        preparedTaxonomies,
        images,
        setImages,
        processing,
        submit,
    };
}
