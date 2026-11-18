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
        <div className="relative min-h-screen bg-[#F5F4F1]">
            {!isSearching && (
                <div className="mx-auto w-full">
                    {/* Search Bar */}
                    <div className="sticky top-0 z-40 border-b border-[#DEDAD4] bg-white shadow-[0_2px_8px_rgba(40,30,20,0.08)]">
                        {/* <Brands /> */}

                        <div className="relative isolate overflow-hidden bg-blue-500 px-4 py-7">
                            {/* Dekorasi salju */}
                            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                                <div
                                    className="absolute top-2 left-[3%] size-8 opacity-20"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(-15deg)',
                                    }}
                                />

                                <div
                                    className="absolute top-8 left-[17%] size-6 opacity-10"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(12deg)',
                                    }}
                                />

                                <div
                                    className="absolute top-1 left-[30%] size-7 opacity-25"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(25deg)',
                                    }}
                                />

                                <div
                                    className="absolute top-9 left-[45%] size-8 opacity-15"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(-10deg)',
                                    }}
                                />

                                <div
                                    className="absolute top-2 left-[59%] size-6 opacity-20"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(18deg)',
                                    }}
                                />

                                <div
                                    className="absolute top-7 left-[74%] size-8 opacity-10"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(-20deg)',
                                    }}
                                />

                                <div
                                    className="absolute top-1 right-[3%] size-9 opacity-20"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(15deg)',
                                    }}
                                />

                                <div
                                    className="absolute bottom-1 left-[8%] size-6 opacity-15"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(25deg)',
                                    }}
                                />

                                <div
                                    className="absolute bottom-2 left-[25%] size-8 opacity-20"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(-18deg)',
                                    }}
                                />

                                <div
                                    className="absolute bottom-0 left-[42%] size-6 opacity-10"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(10deg)',
                                    }}
                                />

                                <div
                                    className="absolute bottom-2 left-[65%] size-8 opacity-20"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(-25deg)',
                                    }}
                                />

                                <div
                                    className="absolute bottom-1 left-[82%] size-6 opacity-15"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(20deg)',
                                    }}
                                />

                                <div
                                    className="absolute right-[2%] bottom-5 size-7 opacity-25"
                                    style={{
                                        backgroundImage: "url('/snow.svg')",
                                        backgroundSize: 'contain',
                                        transform: 'rotate(-12deg)',
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsSearching(true)}
                                className="relative z-10 flex h-11 w-full items-center gap-3 rounded-md border border-[#DAD5CE] bg-[#F5F4F1] px-3 text-left shadow-inner transition hover:border-blue-300 hover:bg-white"
                            >
                                <Search className="size-5 shrink-0 text-blue-400" />

                                <span className="flex-1 truncate text-sm text-[#77716B]">
                                    {props.keyword ||
                                        'Cari produk yang Anda inginkan...'}
                                </span>

                                {props.keyword && (
                                    <span className="text-xs font-bold text-[#E66B0B]">
                                        Ubah
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="border-b border-[#DEDAD4] bg-white px-3 py-3">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-[#292522]">
                                Kategori
                            </h3>

                            <span className="text-[10px] font-medium text-[#77716B]">
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
                                        className={`shrink-0 rounded-sm border px-3 py-1.5 text-xs font-bold transition ${
                                            active
                                                ? 'border-blue-400 bg-blue-500 text-white shadow-sm'
                                                : 'border-[#DEDAD4] bg-white text-[#625B54] hover:border-blue-500 hover:text-blue-400'
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
                            <div className="border-b border-[#DEDAD4] bg-[#F9F8F6] px-3 py-3">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-[#292522]">
                                        Sub Kategori
                                    </h3>

                                    <span className="text-[10px] font-medium text-[#77716B]">
                                        {props.subCategory !== ''
                                            ? '1 dipilih'
                                            : 'Semua sub kategori'}
                                    </span>
                                </div>

                                <div className="thin-scrollbar flex gap-2 overflow-x-auto pb-1">
                                    <button
                                        type="button"
                                        onClick={() => props.setSubCategory('')}
                                        className={`shrink-0 rounded-sm border px-3 py-1.5 text-xs font-bold transition ${
                                            props.subCategory === ''
                                                ? 'border-blue-400 bg-blue-500 text-white shadow-sm'
                                                : 'border-[#DEDAD4] bg-white text-[#625B54] hover:border-blue-500 hover:text-blue-400'
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
                                                className={`shrink-0 rounded-sm border px-3 py-1.5 text-xs font-bold transition ${
                                                    active
                                                        ? 'border-blue-400 bg-blue-500 text-white shadow-sm'
                                                        : 'border-[#DEDAD4] bg-white text-[#625B54] hover:border-blue-500 hover:text-blue-400'
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
                    {/* <div className="border-b border-[#DEDAD4] bg-white px-3 py-2">
                        <button
                            type="button"
                            onClick={() => setShowTopics((prev) => !prev)}
                            className={`flex w-full items-center justify-between rounded-sm px-2 py-2 transition ${
                                showTopics
                                    ? 'bg-[#FFF0E2] text-[#E66B0B]'
                                    : 'text-[#625B54] hover:bg-[#F5F4F1]'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <Tags className="size-4" />

                                <span className="text-xs font-bold">Topik</span>

                                {props.selectedTopics.length > 0 && (
                                    <span className="rounded-full bg-[#F07818] px-2 py-0.5 text-[10px] font-bold text-white">
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
                <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#F5F4F1]">
                    {/* Search Header */}
                    <div className="sticky top-0 z-50 flex items-center gap-2 border-b border-[#DEDAD4] bg-white px-3 py-3 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setIsSearching(false)}
                            className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-[#DEDAD4] bg-[#F5F4F1] text-blue-500 transition hover:border-[#F07818] hover:bg-[#FFF0E2]"
                        >
                            <ArrowLeft className="size-5" />
                        </button>

                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-[#292522]">
                                Pencarian Produk
                            </h3>

                            <p className="text-[10px] text-[#77716B]">
                                Cari dan atur filter produk
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsSearching(false)}
                            className="flex size-9 shrink-0 items-center justify-center rounded-sm text-[#77716B] transition hover:bg-[#F5F4F1] hover:text-[#E66B0B]"
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
                                className="w-full rounded-sm border border-blue-400 bg-blue-500 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 active:scale-[0.99]"
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
