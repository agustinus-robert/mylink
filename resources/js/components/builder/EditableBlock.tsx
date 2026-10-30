import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

import BuilderSidebar from './BuilderSidebar';

import type { PropertyItem, BuilderFormData } from './BuilderProperties';

import type { TaxonomyItem } from './BuilderTaxonomies';

interface PostTranslation {
    id: number;
    post_id: number;
    language_id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content?: Record<string, any> | null;
}

interface TransactionPost {
    id: number;
    menu_item_id?: number | null;
    is_published?: boolean;
    published_at?: string | null;
    translations?: PostTranslation[];
}

interface BuilderMenuItem {
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

interface BuilderMenu {
    id: number;
    name: string;
    menu_item?: BuilderMenuItem[];
}

interface PageProps {
    [key: string]: any;
    builder?: BuilderMenu[];
    posts?: TransactionPost[];
}

interface EditableBlockProps {
    postId: number | string;
    isEditable?: boolean;
    isSelected?: boolean;
    onSelect?: (postId: number | string) => void;
    children: React.ReactNode;
    className?: string;
    onPreviewChange?: (
        postId: number | string,
        formData: BuilderFormData,
    ) => void;
}

export default function EditableBlock({
    postId,
    isEditable = true,
    isSelected = false,
    onSelect,
    children,
    className = '',
    onPreviewChange,
}: EditableBlockProps) {
    const [isHovered, setIsHovered] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { posts = [], builder = [] } = usePage<PageProps>().props;

    const currentPost = posts.find(
        (post) => String(post.id) === String(postId),
    );

    const menuItemId = currentPost?.menu_item_id;

    const menuItem = builder
        .flatMap((menu) => menu.menu_item ?? [])
        .find((item) => String(item.id) === String(menuItemId));

    const translation = currentPost?.translations?.[0];

    const content = translation?.content ?? {};

    const propertyValues = content.properties ?? {};

    const taxonomyValues = content.taxonomies ?? {};

    const properties: PropertyItem[] = (menuItem?.item_properties ?? []).map(
        (property) => {
            const value =
                propertyValues[String(property.id)] ??
                propertyValues[property.id] ??
                property.value ??
                '';

            return {
                ...property,
                value,
            };
        },
    );

    const taxonomies: TaxonomyItem[] = (menuItem?.item_taxonomies ?? []).map(
        (taxonomy) => {
            const value =
                taxonomyValues[String(taxonomy.id)] ??
                taxonomyValues[taxonomy.id];

            return {
                ...taxonomy,
                modelable_id:
                    typeof value === 'number'
                        ? value
                        : typeof value === 'string' && value !== ''
                          ? Number(value)
                          : (taxonomy.modelable_id ?? null),
            };
        },
    );

    if (!isEditable) {
        return <>{children}</>;
    }

    const handleSelect = (event: React.MouseEvent) => {
        event.stopPropagation();

        setIsSidebarOpen(true);

        onSelect?.(postId);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleChangeSidebar = (formData: BuilderFormData) => {
        onPreviewChange?.(postId, formData);
    };

    return (
        <>
            <div
                onClick={handleSelect}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`relative cursor-pointer transition-all duration-200 ${
                    isSelected || isSidebarOpen
                        ? 'rounded-xl ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950'
                        : isHovered
                          ? 'ring-dashed rounded-xl ring-1 ring-indigo-400/70'
                          : ''
                } ${className}`}
                data-editable="true"
                data-post-id={postId}
            >
                <div className="pointer-events-auto absolute top-2 right-2 z-40 flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={handleSelect}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold shadow-md transition-all ${
                            isSelected || isSidebarOpen
                                ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                                : 'border border-slate-700/80 bg-slate-900/90 text-indigo-400 backdrop-blur-md hover:bg-indigo-600 hover:text-white'
                        }`}
                        title={`Edit Post #${postId}`}
                    >
                        <Pencil className="h-3.5 w-3.5" />

                        <span className="text-[11px]">Post #{postId}</span>
                    </button>
                </div>

                <div className="pt-1 pr-20">{children}</div>
            </div>

            <BuilderSidebar
                isOpen={isSidebarOpen}
                postId={postId}
                properties={properties}
                taxonomies={taxonomies}
                onClose={handleCloseSidebar}
                onChange={handleChangeSidebar}
            />
        </>
    );
}
