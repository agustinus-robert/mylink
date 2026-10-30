import React, { useEffect, useMemo } from 'react';
import { FileText } from 'lucide-react';

export interface GeneralTranslation {
    id: number;
    language_id: number;
    title: string;
    slug: string;
    excerpt: string;
    seo_title: string;
    seo_description: string;
}

export interface GeneralLanguage {
    id: number;
    name: string;
    slug: string;
}

interface BuilderGeneralPropertiesProps {
    languages: GeneralLanguage[];
    translations: GeneralTranslation[];
    setTranslations: (translations: GeneralTranslation[]) => void;
}

export default function BuilderGeneralProperties({
    languages,
    translations,
    setTranslations,
}: BuilderGeneralPropertiesProps) {
    useEffect(() => {}, [languages, translations]);

    const activeTranslation = useMemo(() => {
        return translations[0] ?? null;
    }, [translations]);

    const activeIndex = useMemo(() => {
        if (!activeTranslation) {
            return -1;
        }

        return translations.findIndex(
            (translation) =>
                translation.language_id === activeTranslation.language_id,
        );
    }, [translations, activeTranslation]);

    const activeLanguage = useMemo(() => {
        if (!activeTranslation) {
            return null;
        }

        return (
            languages.find(
                (language) => language.id === activeTranslation.language_id,
            ) ?? null
        );
    }, [languages, activeTranslation]);

    useEffect(() => {}, [activeTranslation, activeIndex, activeLanguage]);

    const updateTranslation = (
        field: keyof GeneralTranslation,
        value: string,
    ) => {
        if (activeIndex === -1) {
            return;
        }

        const next = [...translations];

        next[activeIndex] = {
            ...next[activeIndex],
            [field]: value,
        };

        if (field === 'title') {
            next[activeIndex].slug = value
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]/g, '');
        }

        setTranslations(next);
    };

    if (!activeTranslation) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold tracking-wider text-indigo-400 uppercase">
                    <FileText className="h-3.5 w-3.5" />
                    <span>General</span>
                </div>

                <div className="rounded-lg border border-dashed border-slate-800 p-4 text-center text-xs text-slate-500">
                    Belum ada translation.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold tracking-wider text-indigo-400 uppercase">
                <FileText className="h-3.5 w-3.5" />

                <span>General</span>

                {activeLanguage && (
                    <span className="ml-auto text-[10px] font-normal text-slate-500 normal-case">
                        {activeLanguage.name}
                    </span>
                )}
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="builder-general-title"
                    className="block text-xs font-medium text-slate-300"
                >
                    Judul
                </label>

                <input
                    id="builder-general-title"
                    type="text"
                    value={activeTranslation.title}
                    onChange={(event) =>
                        updateTranslation('title', event.target.value)
                    }
                    placeholder="Masukkan judul..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="builder-general-slug"
                    className="block text-xs font-medium text-slate-300"
                >
                    Slug
                </label>

                <input
                    id="builder-general-slug"
                    type="text"
                    value={activeTranslation.slug}
                    readOnly
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400 outline-none"
                />
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="builder-general-excerpt"
                    className="block text-xs font-medium text-slate-300"
                >
                    Excerpt
                </label>

                <textarea
                    id="builder-general-excerpt"
                    rows={4}
                    value={activeTranslation.excerpt}
                    onChange={(event) =>
                        updateTranslation('excerpt', event.target.value)
                    }
                    placeholder="Ringkasan post..."
                    className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="builder-general-seo-title"
                    className="block text-xs font-medium text-slate-300"
                >
                    SEO Title
                </label>

                <input
                    id="builder-general-seo-title"
                    type="text"
                    value={activeTranslation.seo_title}
                    onChange={(event) =>
                        updateTranslation('seo_title', event.target.value)
                    }
                    placeholder="SEO title..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
            </div>

            <div className="space-y-1.5">
                <label
                    htmlFor="builder-general-seo-description"
                    className="block text-xs font-medium text-slate-300"
                >
                    SEO Description
                </label>

                <textarea
                    id="builder-general-seo-description"
                    rows={4}
                    value={activeTranslation.seo_description}
                    onChange={(event) =>
                        updateTranslation('seo_description', event.target.value)
                    }
                    placeholder="SEO description..."
                    className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
        </div>
    );
}
