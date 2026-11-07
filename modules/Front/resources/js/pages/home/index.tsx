import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect, useRef, useCallback } from 'react';
import Searching from './search';
import Topics from './topic';
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
    detail: {
        prices: number;
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

type Props = {
    topics: Topic[];
    products: Pagination<Product>;
    categories: Category[];
};

export default function Home({ topics, products, categories }: Props) {
    const [searchType, setSearchType] = useState<'keyword' | 'category'>(
        'keyword',
    );
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState<number[]>([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    const [items, setItems] = useState<Product[]>(products.data);
    const [page, setPage] = useState(products.current_page);
    const [lastPage, setLastPage] = useState(products.last_page);
    const [loading, setLoading] = useState(false);

    const sentinelRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef(false);
    const filterRef = useRef(false);
    const scrollRef = useRef(false);

    // Sinkronisasi hasil pencarian
    useEffect(() => {
        setItems(products.data);
        setPage(products.current_page);
        setLastPage(products.last_page);

        requestRef.current = false;
        filterRef.current = false;
        scrollRef.current = false;

        setLoading(false);
    }, [products]);

    // Filter pencarian
    useEffect(() => {
        const timer = setTimeout(() => {
            filterRef.current = true;
            requestRef.current = false;
            scrollRef.current = false;
            setLoading(false);

            router.get(
                route('home'),
                {
                    searchType,
                    ...(searchType === 'keyword' ? { keyword } : { category }),
                    dateFrom,
                    dateTo,
                    topics: selectedTopics,
                },
                {
                    only: ['products', 'topics'],
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 500);

        return () => clearTimeout(timer);
    }, [searchType, keyword, category, dateFrom, dateTo, selectedTopics]);

    // Memuat halaman berikutnya
    const loadNextPage = useCallback(() => {
        if (
            !scrollRef.current ||
            requestRef.current ||
            filterRef.current ||
            loading ||
            page >= lastPage
        ) {
            return;
        }

        requestRef.current = true;
        scrollRef.current = false;
        setLoading(true);

        const params = new URLSearchParams(window.location.search);
        params.set('page', String(page + 1));

        router.get(route('home'), Object.fromEntries(params.entries()), {
            only: ['products'],
            preserveState: true,
            preserveScroll: true,
            replace: true,

            onSuccess: (response) => {
                const next = response.props.products as Pagination<Product>;

                setItems(next.data);
                setPage(next.current_page);
                setLastPage(next.last_page);
            },

            onFinish: () => {
                requestRef.current = false;
                setLoading(false);
            },
        });
    }, [page, lastPage, loading]);

    // Mendeteksi scroll pengguna
    useEffect(() => {
        const handleScroll = () => {
            scrollRef.current = true;
        };

        window.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Observer pagination
    useEffect(() => {
        const element = sentinelRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadNextPage();
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0,
            },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [loadNextPage]);

    return (
        <div className="p-2">
            <div className="min-h-200 max-w-200 border border-gray-300">
                <Searching
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
                />

                <Topics
                    topics={topics}
                    selectedTopics={selectedTopics}
                    onSelect={(name) =>
                        setSelectedTopics((current) =>
                            current.includes(name)
                                ? current.filter((topic) => topic !== name)
                                : [...current, name],
                        )
                    }
                    onClear={() => setSelectedTopics([])}
                />

                <Items
                    products={items}
                    currentPage={page}
                    lastPage={lastPage}
                    loading={loading}
                />

                <div ref={sentinelRef} className="h-2" />

                {loading && (
                    <p className="py-3 text-center text-xs text-gray-400">
                        Memuat produk...
                    </p>
                )}
            </div>
        </div>
    );
}
