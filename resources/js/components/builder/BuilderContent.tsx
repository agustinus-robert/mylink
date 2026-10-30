import React from 'react';

export interface BuilderProperty {
    id?: string | number;
    type?: string;
    props?: Record<string, unknown>;
    content?: Array<{
        type?: string;
        text?: string;
        styles?: Record<string, unknown>;
    }>;
    children?: BuilderProperty[];
}

export type BuilderProperties = Record<string, unknown>;

interface BuilderContentProps {
    value: unknown;
    className?: string;
}

function parseJson(value: string): unknown {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function isBlockNote(value: unknown): value is BuilderProperty[] {
    if (!Array.isArray(value)) {
        return false;
    }

    return value.some(
        (item) =>
            item &&
            typeof item === 'object' &&
            'type' in item &&
            ('content' in item || 'children' in item || 'props' in item),
    );
}

function blockText(block: BuilderProperty): string {
    if (!Array.isArray(block.content)) {
        return '';
    }

    return block.content
        .map((item) => {
            if (typeof item?.text === 'string') {
                return item.text;
            }

            return '';
        })
        .join('');
}

function renderBlock(block: BuilderProperty, index: number): React.ReactNode {
    const text = blockText(block);

    if (block.type === 'paragraph') {
        return (
            <p key={block.id ?? index} className="mb-4">
                {text}
            </p>
        );
    }

    if (block.type === 'heading') {
        const level =
            typeof block.props?.level === 'number' ? block.props.level : 2;

        if (level === 1) {
            return (
                <h1 key={block.id ?? index} className="mb-4">
                    {text}
                </h1>
            );
        }

        if (level === 3) {
            return (
                <h3 key={block.id ?? index} className="mb-4">
                    {text}
                </h3>
            );
        }

        if (level === 4) {
            return (
                <h4 key={block.id ?? index} className="mb-4">
                    {text}
                </h4>
            );
        }

        if (level === 5) {
            return (
                <h5 key={block.id ?? index} className="mb-4">
                    {text}
                </h5>
            );
        }

        if (level === 6) {
            return (
                <h6 key={block.id ?? index} className="mb-4">
                    {text}
                </h6>
            );
        }

        return (
            <h2 key={block.id ?? index} className="mb-4">
                {text}
            </h2>
        );
    }

    if (block.type === 'bulletListItem') {
        return <li key={block.id ?? index}>{text}</li>;
    }

    if (block.type === 'numberedListItem') {
        return <li key={block.id ?? index}>{text}</li>;
    }

    if (block.type === 'checkListItem') {
        return <li key={block.id ?? index}>{text}</li>;
    }

    if (block.type === 'image') {
        const src = typeof block.props?.url === 'string' ? block.props.url : '';

        if (!src) {
            return null;
        }

        return (
            <img
                key={block.id ?? index}
                src={normalizeImageUrl(src)}
                alt={
                    typeof block.props?.caption === 'string'
                        ? block.props.caption
                        : ''
                }
                className="mb-4 max-w-full rounded-lg"
            />
        );
    }

    if (text) {
        return (
            <div key={block.id ?? index} className="mb-4">
                {text}
            </div>
        );
    }

    if (Array.isArray(block.children) && block.children.length > 0) {
        return (
            <div key={block.id ?? index}>{block.children.map(renderBlock)}</div>
        );
    }

    return null;
}

function normalizeImageUrl(value: string): string {
    const image = value.trim();

    if (!image) {
        return '';
    }

    if (
        image.startsWith('http://') ||
        image.startsWith('https://') ||
        image.startsWith('data:') ||
        image.startsWith('blob:')
    ) {
        return image;
    }

    if (image.startsWith('/')) {
        return image;
    }

    if (image.startsWith('storage/')) {
        return `/${image}`;
    }

    return `/storage/${image}`;
}

export function parseBuilderContent(value: unknown): React.ReactNode {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value !== 'string') {
        return null;
    }

    const content = value.trim();

    if (!content) {
        return null;
    }

    const parsed = parseJson(content);

    if (isBlockNote(parsed)) {
        return <div>{parsed.map(renderBlock)}</div>;
    }

    if (parsed && typeof parsed === 'object') {
        return (
            <pre className="overflow-auto whitespace-pre-wrap">
                {JSON.stringify(parsed, null, 2)}
            </pre>
        );
    }

    if (content.startsWith('<') && content.includes('>')) {
        return (
            <div
                dangerouslySetInnerHTML={{
                    __html: content,
                }}
            />
        );
    }

    return content;
}

export function getBuilderProperty(
    properties: BuilderProperties | null | undefined,
    propertyId: string | number,
): unknown {
    if (!properties) {
        return null;
    }

    return properties[String(propertyId)] ?? null;
}

export function getBuilderImageUrl(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const image = value.trim();

    if (!image) {
        return null;
    }

    return normalizeImageUrl(image);
}

export function parseBuilderProperties(
    properties: BuilderProperties | null | undefined,
): Record<string, React.ReactNode> {
    if (!properties) {
        return {};
    }

    return Object.fromEntries(
        Object.entries(properties).map(([key, value]) => [
            key,
            parseBuilderContent(value),
        ]),
    );
}

interface BuilderPropertyProps {
    properties?: BuilderProperties | null;
    propertyId: string | number;
    className?: string;
}

export function BuilderProperty({
    properties,
    propertyId,
    className,
}: BuilderPropertyProps) {
    const value = getBuilderProperty(properties, propertyId);

    if (value === null || value === undefined) {
        return null;
    }

    return <div className={className}>{parseBuilderContent(value)}</div>;
}

export function BuilderContent({ value, className }: BuilderContentProps) {
    return <div className={className}>{parseBuilderContent(value)}</div>;
}
