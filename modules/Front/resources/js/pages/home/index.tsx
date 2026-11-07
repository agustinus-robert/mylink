import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect, useRef } from 'react';
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

    const firstRender = useRef(true);
    const scrollPosition = useRef(0);

    // Filter pencarian.
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
                    ...(searchType === 'keyword' ? { keyword } : { category }),
                    dateFrom,
                    dateTo,
                    topics: selectedTopics,
                },
                {
                    only: ['products', 'topics'],
                    reset: ['products'],
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,

                    onSuccess: () => {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                window.scrollTo({
                                    top: scrollPosition.current,
                                    behavior: 'instant',
                                });
                            });
                        });
                    },
                },
            );
        }, 500);

        return () => window.clearTimeout(timer);
    }, [searchType, keyword, category, dateFrom, dateTo, selectedTopics]);

    return (
        <div className="p-2">
            <div className="max-w-200 border border-gray-300">
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

                <Items products={products} />
            </div>
        </div>
    );
}
