import React, { useEffect, useState } from 'react';
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

type SubCategory = {
    id: number;
    category_id: number;
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

    subCategory: number | '';
    setSubCategory: React.Dispatch<React.SetStateAction<number | ''>>;
    subCategories: SubCategory[];

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

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const urlKeyword = params.get('keyword');
        const urlSearchType = params.get('searchType');

        if (urlKeyword !== null) {
            props.setKeyword(urlKeyword);
        }

        if (urlSearchType === 'keyword' || urlKeyword !== null) {
            props.setSearchType('keyword');
        } else if (urlSearchType === 'category') {
            props.setSearchType('category');
        }
    }, []);

    const toggleCategory = (id: number) => {
        const next = props.category.includes(id)
            ? props.category.filter((item) => item !== id)
            : [...props.category, id];

        props.setCategory(next);

        if (props.subCategory !== '') {
            const selectedSubCategory = props.subCategories.find(
                (item) => item.id === props.subCategory,
            );

            if (
                !selectedSubCategory ||
                !next.includes(selectedSubCategory.category_id)
            ) {
                props.setSubCategory('');
            }
        }
    };

    const filteredSubCategories = props.subCategories.filter((item) =>
        props.category.includes(item.category_id),
    );

    useEffect(() => {
        if (props.subCategory === '') return;

        const selectedSubCategory = props.subCategories.find(
            (item) => item.id === props.subCategory,
        );

        if (
            !selectedSubCategory ||
            !props.category.includes(selectedSubCategory.category_id)
        ) {
            props.setSubCategory('');
        }
    }, [props.category, props.subCategories]);

    return (
        <div className="relative min-h-screen bg-[#FAF8F5]">
            {!isSearching && (
                <div className="mx-auto w-full">
                    {/* Search Bar */}
                    <div className="sticky top-0 z-40 border-b border-[#EAE2D9] bg-white shadow-[0_2px_8px_rgba(90,65,40,0.04)]">
                        <Brands />

                        <div className="px-3 py-3">
                            <button
                                type="button"
                                onClick={() => setIsSearching(true)}
                                className="flex h-11 w-full items-center gap-3 rounded-md border border-[#E9DED3] bg-[#FAF8F5] px-3 text-left shadow-inner transition hover:border-[#D8A47D] hover:bg-[#FFFDFB]"
                            >
                                <Search className="size-5 shrink-0 text-[#C4773D]" />

                                <span className="flex-1 truncate text-sm text-[#A99B8D]">
                                    {props.keyword ||
                                        'Cari produk yang Anda inginkan...'}
                                </span>

                                {props.keyword && (
                                    <span className="text-xs font-semibold text-[#C4773D]">
                                        Ubah
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="border-b border-[#EAE2D9] bg-white px-3 py-3">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-[#665548]">
                                Kategori
                            </h3>

                            <span className="text-[10px] text-[#A99B8D]">
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
                                                ? 'border-[#E8C3A3] bg-[#FFF1E5] text-[#B66B35]'
                                                : 'border-[#EAE2D9] bg-white text-[#928477] hover:border-[#D8A47D] hover:bg-[#FAF5EF]'
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sub Categories */}
                    {props.category.length > 0 &&
                        filteredSubCategories.length > 0 && (
                            <div className="border-b border-[#EAE2D9] bg-[#FDFBF8] px-3 py-3">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-[#665548]">
                                        Sub Kategori
                                    </h3>

                                    <span className="text-[10px] text-[#A99B8D]">
                                        {props.subCategory !== ''
                                            ? '1 dipilih'
                                            : 'Semua sub kategori'}
                                    </span>
                                </div>

                                <div className="thin-scrollbar flex gap-2 overflow-x-auto pb-1">
                                    <button
                                        type="button"
                                        onClick={() => props.setSubCategory('')}
                                        className={`shrink-0 rounded-sm border px-3 py-1.5 text-xs font-semibold transition ${
                                            props.subCategory === ''
                                                ? 'border-[#E8C3A3] bg-[#FFF1E5] text-[#B66B35]'
                                                : 'border-[#EAE2D9] bg-white text-[#928477] hover:border-[#D8A47D]'
                                        }`}
                                    >
                                        Semua
                                    </button>

                                    {filteredSubCategories.map((item) => {
                                        const active =
                                            props.subCategory === item.id;

                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() =>
                                                    props.setSubCategory(
                                                        active ? '' : item.id,
                                                    )
                                                }
                                                className={`shrink-0 rounded-sm border px-3 py-1.5 text-xs font-semibold transition ${
                                                    active
                                                        ? 'border-[#E8C3A3] bg-[#FFF1E5] text-[#B66B35]'
                                                        : 'border-[#EAE2D9] bg-white text-[#928477] hover:border-[#D8A47D]'
                                                }`}
                                            >
                                                {item.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    {/* Popular Topics Toggle */}
                    {/* <div className="border-b border-[#EAE2D9] bg-white px-3 py-2">
                        <button
                            type="button"
                            onClick={() => setShowTopics((prev) => !prev)}
                            className={`flex w-full items-center justify-between rounded-sm px-2 py-2 transition ${
                                showTopics
                                    ? 'bg-[#FFF1E5] text-[#B66B35]'
                                    : 'text-[#806F60] hover:bg-[#FAF5EF]'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <Tags className="size-4" />

                                <span className="text-xs font-bold">Topik</span>

                                {props.selectedTopics.length > 0 && (
                                    <span className="rounded-full bg-[#FFF1E5] px-2 py-0.5 text-[10px] font-semibold text-[#B66B35]">
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
                    </div> */}

                    {/* Product Items */}
                    <div className="w-full">{props.children}</div>
                </div>
            )}

            {/* Fullscreen Search View */}
            {isSearching && (
                <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#FAF8F5]">
                    {/* Search Header */}
                    <div className="sticky top-0 z-50 flex items-center gap-2 border-b border-[#EAE2D9] bg-white px-3 py-3 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setIsSearching(false)}
                            className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-[#EAE2D9] bg-[#FAF8F5] text-[#B66B35] transition hover:bg-[#FFF1E5]"
                        >
                            <ArrowLeft className="size-5" />
                        </button>

                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-[#665548]">
                                Pencarian Produk
                            </h3>

                            <p className="text-[10px] text-[#A99B8D]">
                                Cari dan atur filter produk
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsSearching(false)}
                            className="flex size-9 shrink-0 items-center justify-center rounded-sm text-[#928477] transition hover:bg-[#FAF5EF]"
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

                        {/* Price Filter */}
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
                                className="w-full rounded-sm border border-[#D69B70] bg-[#C4773D] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#AD6331]"
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
