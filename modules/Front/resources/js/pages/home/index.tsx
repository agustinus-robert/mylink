import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect } from 'react';
import Searching from './search';
import Topics from './topic';
import Items from './items';

type Topic = {
    id: number;
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

type Category = {
    id: number;
    name: string;
};

type Props = {
    topics: Topic[];
    products: Product[];
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

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = {
                searchType,
                keyword: searchType === 'keyword' ? keyword : '',
                category: searchType === 'category' ? category : [],
                dateFrom,
                dateTo,
            };

            router.get(route('home'), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [searchType, keyword, category, dateFrom, dateTo]);

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

                <Topics topics={topics} />

                <Items products={products} />
            </div>
        </div>
    );
}
