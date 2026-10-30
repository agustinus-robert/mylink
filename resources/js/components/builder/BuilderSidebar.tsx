import React from 'react';
import { X, Save, Sliders } from 'lucide-react';
import { usePage } from '@inertiajs/react';

import BuilderGeneralProperties, {
    type GeneralLanguage,
} from './BuilderGeneralProperties';

import BuilderProperties, { type PropertyItem } from './BuilderProperties';

import BuilderTaxonomies, {
    type TaxonomyItem,
    type TaxonomyOption,
} from './BuilderTaxonomies';

import BuilderPhoto, { type BuilderImages } from './BuilderPhoto';

import { useBuilderSidebar } from './useBuilderSidebar';

import type { TransactionPost } from './builderUtils';

interface SharedProps {
    [key: string]: unknown;
    languages?: GeneralLanguage[];
    posts?: TransactionPost[];
}

interface Props {
    isOpen: boolean;
    postId: number | string | null;
    post?: TransactionPost | null;
    properties?: PropertyItem[];
    taxonomies?: TaxonomyItem[];
    taxonomy?: {
        categories?: TaxonomyOption[];
        tags?: TaxonomyOption[];
    };
    languages?: GeneralLanguage[];
    onClose: () => void;
    onChange?: (data: any) => void;
}

export default function BuilderSidebar({
    isOpen,
    postId,
    post,
    properties = [],
    taxonomies = [],
    languages = [],
    onClose,
    onChange,
}: Props) {
    const { props } = usePage<SharedProps>();

    const builder = useBuilderSidebar({
        isOpen,
        postId,
        post,
        properties,
        taxonomies,
        languages,
        shared: props,
    });

    React.useEffect(() => {
        if (!isOpen) {
            return;
        }

        onChange?.(builder.builderData);
    }, [builder.builderData, isOpen, onChange]);

    if (!isOpen || !postId) {
        return null;
    }

    return (
        <div
            className="fixed inset-y-0 left-0 z-50 flex h-screen w-80 max-w-[400px] min-w-[320px] animate-in flex-col justify-between border-r border-slate-800 bg-slate-900 text-slate-100 shadow-2xl duration-200 slide-in-from-left"
            onClick={(e) => e.stopPropagation()}
        >
            <Header
                postId={postId}
                processing={builder.processing}
                onClose={onClose}
            />

            <form
                id={`builder-form-${postId}`}
                onSubmit={builder.submit}
                className="custom-scrollbar flex-1 space-y-6 overflow-x-visible overflow-y-auto p-4"
            >
                <BuilderGeneralProperties
                    languages={builder.languages}
                    translations={builder.translations}
                    setTranslations={builder.setTranslations}
                />

                <BuilderProperties
                    properties={properties}
                    data={builder.builderData}
                    setData={builder.setData}
                />

                <BuilderTaxonomies
                    taxonomies={builder.preparedTaxonomies}
                    data={builder.builderData}
                    setData={builder.setData}
                />

                <BuilderPhoto
                    images={builder.images}
                    setImages={builder.setImages}
                />
            </form>

            <Footer
                postId={postId}
                processing={builder.processing}
                onClose={onClose}
            />
        </div>
    );
}

function Header({
    postId,
    processing,
    onClose,
}: {
    postId: number | string;
    processing: boolean;
    onClose: () => void;
}) {
    return (
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
                <div className="rounded-lg border border-indigo-500/30 bg-indigo-600/20 p-2 text-indigo-400">
                    <Sliders className="h-4 w-4" />
                </div>

                <div>
                    <h3 className="text-xs font-bold tracking-wider text-white uppercase">
                        Editor Konten
                    </h3>

                    <p className="text-[11px] text-slate-400">
                        Post ID: #{postId}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

function Footer({
    postId,
    processing,
    onClose,
}: {
    postId: number | string;
    processing: boolean;
    onClose: () => void;
}) {
    return (
        <div className="flex shrink-0 items-center gap-2 border-t border-slate-800 bg-slate-950 p-4">
            <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="w-1/2 rounded-lg border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            >
                Batal
            </button>

            <button
                type="submit"
                form={`builder-form-${postId}`}
                disabled={processing}
                className="flex w-1/2 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-50"
            >
                <Save className="h-3.5 w-3.5" />
                {processing ? 'Menyimpan...' : 'Simpan'}
            </button>
        </div>
    );
}
