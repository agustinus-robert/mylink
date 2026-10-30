import type { PropertyItem } from '../components/builder/BuilderProperties';
import type { BuilderFormData } from '../components/builder/BuilderProperties';
import type { TaxonomyItem } from '../components/builder/BuilderTaxonomies';
import type { PostPreview } from '../components/preview/PostPreview';

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

export interface HomeProps {
    postId?: number | string | null;
    post?: PostPreview | null;
    isEditable?: boolean;
    selectedMenuItemId?: number | string | null;
    onSelectBlock?: (id: number | string) => void;
}

export type { BuilderFormData };
