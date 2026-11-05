import { router, InfiniteScroll } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect } from 'react';
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

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = {
                searchType,
                ...(searchType === 'keyword' ? { keyword } : { category }),
                dateFrom,
                dateTo,
                topics: selectedTopics,
            };

            router.get(route('home'), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                reset: ['products'],
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [searchType, keyword, category, dateFrom, dateTo, selectedTopics]);

    const handleTopicSelect = (name: string) => {
        setSelectedTopics((current) =>
            current.includes(name)
                ? current.filter((topic) => topic !== name)
                : [...current, name],
        );
    };

    const handleClearTopics = () => {
        setSelectedTopics([]);
    };

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
                    onSelect={handleTopicSelect}
                    onClear={handleClearTopics}
                />

                <InfiniteScroll data="products">
                    <Items products={products.data} />
                </InfiniteScroll>
            </div>
        </div>
    );
}
