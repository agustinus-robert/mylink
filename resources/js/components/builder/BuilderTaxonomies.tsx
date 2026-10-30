import React from 'react';
import { Layers } from 'lucide-react';

export interface TaxonomyOption {
    id: number;
    name: string;
}

export interface TaxonomyItem {
    id: number;
    menu_item_id?: number;
    label: string;
    chooser_type: number;
    modelable_id?: number | null;
    modelable_type?: string;
    value?: string | number | number[] | null;
    options?: TaxonomyOption[];
}

export type BuilderValue = string | number | null | number[];

export interface BuilderFormData {
    [key: string]: BuilderValue;
}

interface BuilderTaxonomiesProps {
    taxonomies: TaxonomyItem[];
    data: BuilderFormData;
    setData: <K extends keyof BuilderFormData>(
        key: K,
        value: BuilderFormData[K],
    ) => void;
}

export default function BuilderTaxonomies({
    taxonomies,
    data,
    setData,
}: BuilderTaxonomiesProps) {
    const inputClass =
        'w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none';

    if (taxonomies.length === 0) {
        return null;
    }

    const getTaxonomyValue = (taxonomy: TaxonomyItem): BuilderValue => {
        const fieldName = `taxonomy_${taxonomy.id}`;

        if (Object.prototype.hasOwnProperty.call(data, fieldName)) {
            return data[fieldName];
        }

        return taxonomy.value ?? null;
    };

    const normalizeSingleValue = (value: BuilderValue): number | null => {
        if (value === null || value === undefined || value === '') {
            return null;
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return null;
            }

            const number = Number(value[0]);

            return Number.isFinite(number) ? number : null;
        }

        const number = Number(value);

        return Number.isFinite(number) ? number : null;
    };

    const normalizeMultipleValue = (value: BuilderValue): number[] => {
        if (value === null || value === undefined || value === '') {
            return [];
        }

        if (Array.isArray(value)) {
            return Array.from(
                new Set(value.map(Number).filter(Number.isFinite)),
            );
        }

        if (typeof value === 'number') {
            return Number.isFinite(value) ? [value] : [];
        }

        if (typeof value === 'string') {
            const trimmed = value.trim();

            if (!trimmed) {
                return [];
            }

            try {
                const parsed: unknown = JSON.parse(trimmed);

                if (Array.isArray(parsed)) {
                    return Array.from(
                        new Set(parsed.map(Number).filter(Number.isFinite)),
                    );
                }

                const number = Number(parsed);

                return Number.isFinite(number) ? [number] : [];
            } catch {
                const number = Number(trimmed);

                return Number.isFinite(number) ? [number] : [];
            }
        }

        return [];
    };

    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold tracking-wider text-emerald-400 uppercase">
                <Layers className="h-3.5 w-3.5" />
                <span>Taxonomies ({taxonomies.length})</span>
            </div>

            {taxonomies.map((taxonomy) => {
                const fieldName = `taxonomy_${taxonomy.id}`;
                const currentValue = getTaxonomyValue(taxonomy);
                const options = Array.isArray(taxonomy.options)
                    ? taxonomy.options
                    : [];

                if (taxonomy.chooser_type === 1) {
                    const selectedValue = normalizeSingleValue(currentValue);

                    return (
                        <div key={taxonomy.id} className="space-y-1.5">
                            <label className="block text-xs font-medium text-slate-300">
                                {taxonomy.label}
                            </label>

                            <div className="space-y-2">
                                {options.map((option) => {
                                    const optionId = Number(option.id);
                                    const checked = selectedValue === optionId;

                                    return (
                                        <label
                                            key={option.id}
                                            className="flex cursor-pointer items-center gap-2 text-xs text-slate-300"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => {
                                                    setData(
                                                        fieldName,
                                                        checked
                                                            ? null
                                                            : optionId,
                                                    );
                                                }}
                                                className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                                            />

                                            <span>{option.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }

                if (taxonomy.chooser_type === 2) {
                    const selectedValues = normalizeMultipleValue(currentValue);

                    return (
                        <div key={taxonomy.id} className="space-y-1.5">
                            <label className="block text-xs font-medium text-slate-300">
                                {taxonomy.label}
                            </label>

                            <div className="space-y-2">
                                {options.map((option) => {
                                    const optionId = Number(option.id);
                                    const checked =
                                        selectedValues.includes(optionId);

                                    return (
                                        <label
                                            key={option.id}
                                            className="flex cursor-pointer items-center gap-2 text-xs text-slate-300"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(event) => {
                                                    const nextValues = event
                                                        .target.checked
                                                        ? Array.from(
                                                              new Set([
                                                                  ...selectedValues,
                                                                  optionId,
                                                              ]),
                                                          )
                                                        : selectedValues.filter(
                                                              (id) =>
                                                                  id !==
                                                                  optionId,
                                                          );

                                                    setData(
                                                        fieldName,
                                                        nextValues,
                                                    );
                                                }}
                                                className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                                            />

                                            <span>{option.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }

                if (taxonomy.chooser_type === 3) {
                    const selectedValue = normalizeSingleValue(currentValue);

                    return (
                        <div key={taxonomy.id} className="space-y-1.5">
                            <label className="block text-xs font-medium text-slate-300">
                                {taxonomy.label}
                            </label>

                            <div className="space-y-2">
                                {options.map((option) => {
                                    const optionId = Number(option.id);
                                    const checked = selectedValue === optionId;

                                    return (
                                        <label
                                            key={option.id}
                                            className="flex cursor-pointer items-center gap-2 text-xs text-slate-300"
                                        >
                                            <input
                                                type="radio"
                                                name={fieldName}
                                                value={optionId}
                                                checked={checked}
                                                onChange={() => {
                                                    setData(
                                                        fieldName,
                                                        optionId,
                                                    );
                                                }}
                                                className="border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                                            />

                                            <span>{option.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }

                if (taxonomy.chooser_type === 4) {
                    const selectedValue = normalizeSingleValue(currentValue);

                    return (
                        <div key={taxonomy.id} className="space-y-1.5">
                            <label className="block text-xs font-medium text-slate-300">
                                {taxonomy.label}
                            </label>

                            <select
                                value={
                                    selectedValue === null
                                        ? ''
                                        : String(selectedValue)
                                }
                                onChange={(event) => {
                                    const value = event.target.value;

                                    setData(
                                        fieldName,
                                        value === '' ? null : Number(value),
                                    );
                                }}
                                className={inputClass}
                            >
                                <option value="">-- Pilih --</option>

                                {options.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }

                if (taxonomy.chooser_type === 5) {
                    const selectedValue = normalizeSingleValue(currentValue);

                    return (
                        <div key={taxonomy.id} className="space-y-1.5">
                            <label className="block text-xs font-medium text-slate-300">
                                {taxonomy.label}
                            </label>

                            <select
                                value={
                                    selectedValue === null
                                        ? ''
                                        : String(selectedValue)
                                }
                                onChange={(event) => {
                                    const value = event.target.value;

                                    setData(
                                        fieldName,
                                        value === '' ? null : Number(value),
                                    );
                                }}
                                className={inputClass}
                            >
                                <option value="">-- Cari dan pilih --</option>

                                {options.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}
