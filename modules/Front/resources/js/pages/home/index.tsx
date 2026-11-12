import { router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect, useRef } from 'react';
import Searching from './search';
import Items from './items';

type Topic = {
    name: string;
    count: number;
};

type Product = {
    id: number;
    name: string;
    link: string;
    affiliate_link: string;
    related: string | null;
    detail: {
        prices: number;
        location?: {
            district?: {
                city_name: string;
                type: string;
            } | null;
        } | null;
    } | null;
};

type Pagination<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
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

type Props = {
    topics: Topic[];
    products: Pagination<Product>;
    categories: Category[];
    provinces: Province[];
    regencies: Regency[];
};

export default function Home({
    topics,
    products,
    categories,
    provinces,
    regencies,
}: Props) {
    const { url } = usePage();

    const currentUrl = new URL(url, window.location.origin);

    const relatedFilter = currentUrl.searchParams.get('related') === '1';
    const sort = currentUrl.searchParams.get('sort') || 'desc';

    const [searchType, setSearchType] = useState<'keyword' | 'category'>(
        'keyword',
    );

    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState<number[]>([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    const [province, setProvince] = useState('');
    const [regency, setRegency] = useState('');

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const firstRender = useRef(true);
    const scrollPosition = useRef(0);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            scrollPosition.current = window.scrollY;

            router.get(
                route('home'),
                {
                    searchType,
                    ...(searchType === 'keyword'
                        ? { keyword: keyword || undefined }
                        : {
                              category: category.length ? category : undefined,
                          }),

                    dateFrom: dateFrom || undefined,
                    dateTo: dateTo || undefined,
                    topics: selectedTopics.length ? selectedTopics : undefined,
                    province: province || undefined,
                    regency: regency || undefined,
                    minPrice: minPrice || undefined,
                    maxPrice: maxPrice || undefined,

                    // Pertahankan filter Related.
                    related: relatedFilter ? 1 : undefined,

                    // Pertahankan sorting.
                    sort,
                },
                {
                    only: ['products', 'topics', 'regencies'],
                    reset: ['products'],
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onSuccess: () => {
                        requestAnimationFrame(() => {
                            window.scrollTo({
                                top: scrollPosition.current,
                                behavior: 'instant',
                            });
                        });
                    },
                },
            );
        }, 500);

        return () => window.clearTimeout(timer);
    }, [
        searchType,
        keyword,
        category,
        dateFrom,
        dateTo,
        selectedTopics,
        province,
        regency,
        minPrice,
        maxPrice,
        relatedFilter,
        sort,
    ]);

    return (
        <div className="mb-2 w-full">
            <div className="sticky top-0 z-40 mx-auto w-full max-w-210 bg-[#fafdff]">
                <Searching
                    compact={false}
                    searchType={searchType}
                    setSearchType={setSearchType}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    category={category}
                    setCategory={setCategory}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    setDateFrom={setDateFrom}
                    setDateTo={setDateTo}
                    categories={categories}
                    province={province}
                    setProvince={setProvince}
                    regency={regency}
                    setRegency={setRegency}
                    provinces={provinces}
                    regencies={regencies}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    setMinPrice={setMinPrice}
                    setMaxPrice={setMaxPrice}
                    topics={topics}
                    selectedTopics={selectedTopics}
                    onSelectTopic={(name: string) =>
                        setSelectedTopics((current) =>
                            current.includes(name)
                                ? current.filter((topic) => topic !== name)
                                : [...current, name],
                        )
                    }
                    onClearTopics={() => setSelectedTopics([])}
                >
                    <Items products={products} />
                </Searching>
            </div>
        </div>
    );
}
