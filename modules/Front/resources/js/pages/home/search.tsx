import React, { useState } from 'react';
import {
    Search,
    ArrowLeft,
    X,
    Tags,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

import Brands from '../../../../../../resources/js/components/app-brand';
import PriceRange from './price-range';
import SearchForm from './search-form';
import Location from './location';
import Topics from './topic';

type Topic = {
    name: string;
    count: number;
};

type Category = {
    id: number;
    name: string;
};

type Province = {
    id: number;
    name: string;
};

type Regency = {
    id: number;
    province_id: number;
    type: string;
    name: string;
};

type SearchingProps = {
    compact: boolean;

    searchType: 'keyword' | 'category';
    setSearchType: (value: 'keyword' | 'category') => void;

    keyword: string;
    setKeyword: (value: string) => void;

    category: number[];
    setCategory: React.Dispatch<React.SetStateAction<number[]>>;

    dateFrom: string;
    dateTo: string;
    setDateFrom: (value: string) => void;
    setDateTo: (value: string) => void;

    categories: Category[];

    province: string;
    setProvince: (value: string) => void;

    regency: string;
    setRegency: (value: string) => void;

    provinces: Province[];
    regencies: Regency[];

    topics: Topic[];
    selectedTopics: string[];
    onSelectTopic: (name: string) => void;
    onClearTopics: () => void;

    children?: React.ReactNode;
    minPrice: string;
    maxPrice: string;
    setMinPrice: (value: string) => void;
    setMaxPrice: (value: string) => void;
};

export default function Searching(props: SearchingProps) {
    const [isSearching, setIsSearching] = useState(false);
    const [showTopics, setShowTopics] = useState(false);

    const toggleCategory = (id: number) => {
        props.setCategory((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    return (
        <div className="relative min-h-screen bg-[#f5f7fa]">
            {!isSearching && (
                <div className="mx-auto w-full">
                    {/* Search Bar */}
                    <div className="sticky top-0 z-40 border-b border-[#dce4ec] bg-white shadow-sm">
                        <Brands />
                        <div className="px-3 py-3">
                            <button
                                type="button"
                                onClick={() => setIsSearching(true)}
                                className="flex h-11 w-full items-center gap-3 rounded-md border border-[#d4e0eb] bg-[#f8fafc] px-3 text-left shadow-inner transition hover:border-[#a9c8e0]"
                            >
                                <Search className="size-5 shrink-0 text-[#6487a5]" />

                                <span className="flex-1 truncate text-sm text-[#91a1b1]">
                                    {props.keyword ||
                                        'Cari produk yang Anda inginkan...'}
                                </span>

                                {props.keyword && (
                                    <span className="text-xs text-[#6487a5]">
                                        Ubah
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="border-b border-[#dce4ec] bg-white px-3 py-3">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-[#566779]">
                                Kategori
                            </h3>

                            <span className="text-[10px] text-[#91a1b1]">
                                {props.category.length} dipilih
                            </span>
                        </div>

                        <div className="thin-scrollbar flex gap-2 overflow-x-auto pb-1">
                            {props.categories.map((item) => {
                                const active = props.category.includes(item.id);

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCategory(item.id)}
                                        className={`shrink-0 rounded-sm border px-3 py-1.5 text-xs font-semibold transition ${
                                            active
                                                ? 'border-[#e6c99f] bg-[#fff3df] text-[#986b37]'
                                                : 'border-[#dce4ec] bg-white text-[#8296a9] hover:border-[#c5d9e9]'
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Popular Topics Toggle */}
                    <div className="border-b border-[#dce4ec] bg-white px-3 py-2">
                        <button
                            type="button"
                            onClick={() => setShowTopics((prev) => !prev)}
                            className={`flex w-full items-center justify-between rounded-sm px-2 py-2 transition ${
                                showTopics
                                    ? 'bg-[#eef4f9] text-[#4b83ad]'
                                    : 'text-[#64788b] hover:bg-[#f5f8fb]'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <Tags className="size-4" />

                                <span className="text-xs font-bold">Topik</span>

                                {props.selectedTopics.length > 0 && (
                                    <span className="rounded-full bg-[#e5eff8] px-2 py-0.5 text-[10px] font-semibold text-[#4b83ad]">
                                        {props.selectedTopics.length}
                                    </span>
                                )}
                            </span>

                            {showTopics ? (
                                <ChevronUp className="size-4" />
                            ) : (
                                <ChevronDown className="size-4" />
                            )}
                        </button>

                        {showTopics && (
                            <div className="pt-2">
                                <Topics
                                    topics={props.topics}
                                    selectedTopics={props.selectedTopics}
                                    onSelect={props.onSelectTopic}
                                    onClear={props.onClearTopics}
                                />
                            </div>
                        )}
                    </div>

                    {/* Product Items */}
                    <div className="w-full">{props.children}</div>
                </div>
            )}

            {/* Fullscreen Search View */}
            {isSearching && (
                <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#f5f7fa]">
                    {/* Search Header */}
                    <div className="sticky top-0 z-50 flex items-center gap-2 border-b border-[#dce4ec] bg-white px-3 py-3 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setIsSearching(false)}
                            className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-[#dce4ec] bg-[#f8fafc] text-[#6487a5]"
                        >
                            <ArrowLeft className="size-5" />
                        </button>

                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-[#40566b]">
                                Pencarian Produk
                            </h3>

                            <p className="text-[10px] text-[#91a1b1]">
                                Cari dan atur filter produk
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsSearching(false)}
                            className="flex size-9 shrink-0 items-center justify-center rounded-sm text-[#8296a9] hover:bg-[#f0f4f8]"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Search Form */}
                    <div className="mx-auto w-full max-w-2xl">
                        <SearchForm
                            compact={false}
                            searchType={props.searchType}
                            setSearchType={props.setSearchType}
                            keyword={props.keyword}
                            setKeyword={props.setKeyword}
                            category={props.category}
                            setCategory={props.setCategory}
                            dateFrom={props.dateFrom}
                            dateTo={props.dateTo}
                            setDateFrom={props.setDateFrom}
                            setDateTo={props.setDateTo}
                            categories={props.categories}
                        />

                        {/* Location Filter */}
                        <Location
                            compact={false}
                            province={props.province}
                            setProvince={props.setProvince}
                            regency={props.regency}
                            setRegency={props.setRegency}
                            provinces={props.provinces}
                            regencies={props.regencies}
                        />

                        <PriceRange
                            minPrice={props.minPrice}
                            maxPrice={props.maxPrice}
                            setMinPrice={props.setMinPrice}
                            setMaxPrice={props.setMaxPrice}
                        />

                        {/* Back to Items */}
                        <div className="p-3">
                            <button
                                type="button"
                                onClick={() => setIsSearching(false)}
                                className="w-full rounded-sm border border-[#a9c8e0] bg-gradient-to-b from-[#fafdff] to-[#dfedf8] px-4 py-3 text-sm font-bold text-[#4b83ad] shadow-sm transition hover:to-[#d5e8f6]"
                            >
                                Tampilkan Produk
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
