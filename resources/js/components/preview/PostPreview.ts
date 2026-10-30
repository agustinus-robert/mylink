export interface PostPreview {
    id: number | string;
    content?: {
        properties?: Record<string, unknown>;
        taxonomies?: Record<string, unknown>;
        images?: Record<string, unknown>;
    } | null;
}

export interface PostPreviewData {
    postId: number | string | null;
    properties: Record<string, unknown>;
    taxonomies: Record<string, unknown>;
    images: {
        desktop: string | null;
        tablet: string | null;
        mobile: string | null;
    };
    get: (id: number | string) => unknown;
    text: (id: number | string, fallback?: string) => string;
    html: (id: number | string, fallback?: string) => string;
    blockNoteText: (id: number | string, fallback?: string) => string;
    image: (type: 'desktop' | 'tablet' | 'mobile') => string | null;
}

export function createPostPreviewData(
    post: PostPreview | null | undefined,
    postId?: number | string | null,
): PostPreviewData {
    let content = post?.content ?? null;

    if (typeof content === 'string') {
        try {
            content = JSON.parse(content);
        } catch {
            content = null;
        }
    }

    const properties =
        content && typeof content === 'object'
            ? (content.properties ?? {})
            : {};

    const taxonomies =
        content && typeof content === 'object'
            ? (content.taxonomies ?? {})
            : {};

    const rawImages =
        content && typeof content === 'object' ? (content.images ?? {}) : {};

    const get = (id: number | string): unknown => {
        return properties[String(id)];
    };

    const text = (id: number | string, fallback = ''): string => {
        const value = get(id);

        if (value === undefined || value === null) {
            return fallback;
        }

        if (typeof value === 'string') {
            const valueTrimmed = value.trim();

            if (!valueTrimmed) {
                return fallback;
            }

            if (valueTrimmed.startsWith('<') && valueTrimmed.endsWith('>')) {
                return stripHtml(valueTrimmed) || fallback;
            }

            try {
                const parsed = JSON.parse(valueTrimmed);

                if (Array.isArray(parsed)) {
                    return extractBlockNoteText(parsed) || fallback;
                }
            } catch {}

            return value;
        }

        if (typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }

        return fallback;
    };

    const html = (id: number | string, fallback = ''): string => {
        const value = get(id);

        if (typeof value !== 'string' || !value.trim()) {
            return fallback;
        }

        return value;
    };

    const blockNoteText = (id: number | string, fallback = ''): string => {
        const value = get(id);

        if (typeof value !== 'string' || !value.trim()) {
            return fallback;
        }

        try {
            const blocks = JSON.parse(value);

            if (!Array.isArray(blocks)) {
                return fallback;
            }

            return extractBlockNoteText(blocks) || fallback;
        } catch {
            return fallback;
        }
    };

    const normalizeImage = (value: unknown): string | null => {
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

        if (image.startsWith('/storage/')) {
            return image;
        }

        if (image.startsWith('storage/')) {
            return `/${image}`;
        }

        if (image.startsWith('posts/images/')) {
            return `/storage/${image}`;
        }

        return `/storage/posts/images/${image}`;
    };

    const images = {
        desktop: normalizeImage(rawImages.desktop),
        tablet: normalizeImage(rawImages.tablet),
        mobile: normalizeImage(rawImages.mobile),
    };

    return {
        postId: postId ?? post?.id ?? null,
        properties,
        taxonomies,
        images,
        get,
        text,
        html,
        blockNoteText,
        image: (type) => images[type],
    };
}

function extractBlockNoteText(blocks: unknown[]): string {
    return blocks
        .flatMap((block: any) => {
            if (!Array.isArray(block?.content)) {
                return [];
            }

            return block.content
                .filter(
                    (item: any) =>
                        item &&
                        typeof item === 'object' &&
                        typeof item.text === 'string',
                )
                .map((item: any) => item.text);
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function stripHtml(value: string): string {
    if (typeof document === 'undefined') {
        return value.replace(/<[^>]*>/g, '').trim();
    }

    const element = document.createElement('div');
    element.innerHTML = value;

    return (element.textContent || element.innerText || '')
        .replace(/\s+/g, ' ')
        .trim();
}
