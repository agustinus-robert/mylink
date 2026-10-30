import React, { useState } from 'react';
import { ExternalLink, Sliders } from 'lucide-react';

import FloatingEditor from './FloatingEditor';

export interface PropertyItem {
    id: number;
    menu_item_id?: number;
    label: string;
    editor_type: number;
    value?: string | number | null;
}

export type BuilderValue = string | number | null | number[];

export interface BuilderFormData {
    [key: string]: BuilderValue;
}

interface BuilderPropertiesProps {
    properties: PropertyItem[];
    data: BuilderFormData;
    setData: <K extends keyof BuilderFormData>(
        key: K,
        value: BuilderFormData[K],
    ) => void;
}

export default function BuilderProperties({
    properties,
    data,
    setData,
}: BuilderPropertiesProps) {
    const [floatingEditor, setFloatingEditor] = useState<{
        propertyId: number | null;
        type: 'tinymce' | 'blocknote';
    }>({
        propertyId: null,
        type: 'tinymce',
    });

    const inputClass =
        'w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none';

    const getPropertyValue = (property: PropertyItem): string => {
        const value = data[`prop_${property.id}`];

        if (value === null || value === undefined) {
            return '';
        }

        return String(value);
    };

    const getPropertyPreview = (property: PropertyItem): string => {
        const value = getPropertyValue(property);

        if (!value) {
            return '';
        }

        if (property.editor_type === 2) {
            try {
                const blocks = JSON.parse(value);

                if (Array.isArray(blocks)) {
                    return blocks
                        .flatMap((block) =>
                            Array.isArray(block.content)
                                ? block.content
                                      .filter(
                                          (content: unknown) =>
                                              typeof content === 'object' &&
                                              content !== null &&
                                              'text' in content,
                                      )
                                      .map(
                                          (content: { text?: string }) =>
                                              content.text ?? '',
                                      )
                                : [],
                        )
                        .join(' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                }
            } catch {
                return value.replace(/\s+/g, ' ').trim();
            }
        }

        if (property.editor_type === 1) {
            const element = document.createElement('div');
            element.innerHTML = value;

            return element.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        }

        return value;
    };

    const openFloatingEditor = (property: PropertyItem) => {
        if (property.editor_type === 1) {
            setFloatingEditor({
                propertyId: property.id,
                type: 'tinymce',
            });

            return;
        }

        if (property.editor_type === 2) {
            setFloatingEditor({
                propertyId: property.id,
                type: 'blocknote',
            });
        }
    };

    const closeFloatingEditor = () => {
        setFloatingEditor({
            propertyId: null,
            type: 'tinymce',
        });
    };

    const handleFloatingEditorChange = (value: string) => {
        const propertyId = floatingEditor.propertyId;

        if (!propertyId) {
            return;
        }

        setData(`prop_${propertyId}`, value);
    };

    const activeFloatingProperty = floatingEditor.propertyId
        ? (properties.find(
              (property) => property.id === floatingEditor.propertyId,
          ) ?? null)
        : null;

    const renderPropertyInput = (property: PropertyItem) => {
        const fieldName = `prop_${property.id}`;
        const value = data[fieldName] ?? '';

        switch (property.editor_type) {
            case 1:
                return (
                    <button
                        type="button"
                        onClick={() => openFloatingEditor(property)}
                        className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-left transition hover:border-indigo-500/50 hover:bg-slate-900"
                    >
                        <div className="min-w-0">
                            <div className="text-xs font-medium text-slate-200">
                                Rich Text Editor (TinyMCE)
                            </div>

                            <div className="mt-1 truncate text-[11px] text-slate-500">
                                {getPropertyPreview(property) ||
                                    'Belum ada isi'}
                            </div>
                        </div>

                        <ExternalLink className="ml-3 h-4 w-4 shrink-0 text-indigo-400" />
                    </button>
                );

            case 2:
                return (
                    <button
                        type="button"
                        onClick={() => openFloatingEditor(property)}
                        className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-left transition hover:border-indigo-500/50 hover:bg-slate-900"
                    >
                        <div className="min-w-0">
                            <div className="text-xs font-medium text-slate-200">
                                Block Editor
                            </div>

                            <div className="mt-1 truncate text-[11px] text-slate-500">
                                {getPropertyPreview(property) ||
                                    'Belum ada isi'}
                            </div>
                        </div>

                        <ExternalLink className="ml-3 h-4 w-4 shrink-0 text-indigo-400" />
                    </button>
                );

            case 3:
                return (
                    <textarea
                        rows={8}
                        value={String(value)}
                        onChange={(event) =>
                            setData(fieldName, event.target.value)
                        }
                        className={inputClass}
                        placeholder={`Masukkan ${property.label}...`}
                    />
                );

            case 4:
                return (
                    <input
                        type="text"
                        value={String(value)}
                        onChange={(event) =>
                            setData(fieldName, event.target.value)
                        }
                        className={inputClass}
                        placeholder={`Masukkan ${property.label}...`}
                    />
                );

            case 5:
                return (
                    <input
                        type="number"
                        value={String(value)}
                        onChange={(event) =>
                            setData(fieldName, event.target.value)
                        }
                        className={inputClass}
                        placeholder={`Masukkan ${property.label}...`}
                    />
                );

            case 6:
                return (
                    <input
                        type="date"
                        value={String(value)}
                        onChange={(event) =>
                            setData(fieldName, event.target.value)
                        }
                        className={inputClass}
                    />
                );

            case 7:
                return (
                    <input
                        type="time"
                        value={String(value)}
                        onChange={(event) =>
                            setData(fieldName, event.target.value)
                        }
                        className={inputClass}
                    />
                );

            case 8:
                return (
                    <input
                        type="datetime-local"
                        value={String(value)}
                        onChange={(event) =>
                            setData(fieldName, event.target.value)
                        }
                        className={inputClass}
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        value={String(value)}
                        onChange={(event) =>
                            setData(fieldName, event.target.value)
                        }
                        className={inputClass}
                        placeholder={`Masukkan ${property.label}...`}
                    />
                );
        }
    };

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold tracking-wider text-indigo-400 uppercase">
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Properties ({properties.length})</span>
                </div>

                {properties.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-800 p-4 text-center text-xs text-slate-500">
                        Belum ada property untuk post ini.
                    </div>
                ) : (
                    properties.map((property) => (
                        <div key={property.id} className="space-y-1.5">
                            <label className="block text-xs font-medium text-slate-300">
                                {property.label}

                                <span className="ml-1 text-[10px] font-normal text-slate-500">
                                    ({property.editor_type})
                                </span>
                            </label>

                            {renderPropertyInput(property)}
                        </div>
                    ))
                )}
            </div>

            {activeFloatingProperty && (
                <FloatingEditor
                    isOpen={floatingEditor.propertyId !== null}
                    type={floatingEditor.type}
                    value={getPropertyValue(activeFloatingProperty)}
                    title={activeFloatingProperty.label}
                    onChange={handleFloatingEditorChange}
                    onClose={closeFloatingEditor}
                />
            )}
        </>
    );
}
