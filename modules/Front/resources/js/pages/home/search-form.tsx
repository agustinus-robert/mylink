import React, { useState, useEffect, useRef } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Search, ListFilter, Calendar, Loader2, X } from 'lucide-react';
import 'react-day-picker/style.css';

type Category = {
    id: number;
    name: string;
};

type ProductSuggestion = {
    id: number;
    name: string;
    code: string | null;
};

type SearchFormProps = {
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
};

export default function SearchForm({
    compact,
    searchType,
    setSearchType,
    keyword,
    setKeyword,
    category,
    setCategory,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    categories,
}: SearchFormProps) {
    const [showCalendar, setShowCalendar] = useState(false);

    // Autocomplete
    const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);

    const searchRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestRef = useRef<AbortController | null>(null);
    const selectedKeywordRef = useRef(false);

    // Request autocomplete
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        requestRef.current?.abort();

        // Jangan munculkan kembali dropdown setelah memilih rekomendasi
        if (selectedKeywordRef.current) {
            selectedKeywordRef.current = false;
            setLoadingSuggestions(false);
            return;
        }

        if (searchType !== 'keyword' || keyword.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            setLoadingSuggestions(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            const controller = new AbortController();
            requestRef.current = controller;

            setLoadingSuggestions(true);

            try {
                const response = await fetch(
                    `/autocomplete/products?keyword=${encodeURIComponent(keyword.trim())}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error('Gagal mengambil rekomendasi produk');
                }

                const result: ProductSuggestion[] = await response.json();

                if (!controller.signal.aborted) {
                    setSuggestions(result.slice(0, 8));
                    setShowSuggestions(true);
                    setActiveSuggestion(-1);
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    setSuggestions([]);
                    setShowSuggestions(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoadingSuggestions(false);
                }
            }
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            requestRef.current?.abort();
        };
    }, [keyword, searchType]);

    // Tutup dropdown ketika klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Pilih rekomendasi
    const selectSuggestion = (item: ProductSuggestion) => {
        selectedKeywordRef.current = true;

        setKeyword(item.name);
        setShowSuggestions(false);
        setSuggestions([]);
        setActiveSuggestion(-1);
        setLoadingSuggestions(false);
    };

    // Navigasi keyboard
    const handleSuggestionKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Escape') {
            setShowSuggestions(false);
            return;
        }

        if (!showSuggestions || suggestions.length === 0) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();

            setActiveSuggestion((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : 0,
            );
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            setActiveSuggestion((prev) =>
                prev > 0 ? prev - 1 : suggestions.length - 1,
            );
        }

        if (event.key === 'Enter' && activeSuggestion >= 0) {
            event.preventDefault();
            selectSuggestion(suggestions[activeSuggestion]);
        }
    };

    const range: DateRange | undefined = dateFrom
        ? {
              from: parseISO(dateFrom),
              to: dateTo ? parseISO(dateTo) : undefined,
          }
        : undefined;

    const toggleCategory = (item: number) => {
        setCategory((prev) =>
            prev.includes(item)
                ? prev.filter((value) => value !== item)
                : [...prev, item],
        );
    };

    const handleDateSelect = (selected: DateRange | undefined) => {
        setDateFrom(selected?.from ? format(selected.from, 'yyyy-MM-dd') : '');

        setDateTo(selected?.to ? format(selected.to, 'yyyy-MM-dd') : '');
    };

    const dateLabel = range?.from
        ? range.to
            ? `${format(range.from, 'dd/MM/yyyy')} – ${format(range.to, 'dd/MM/yyyy')}`
            : `${format(range.from, 'dd/MM/yyyy')} – Pilih tanggal akhir`
        : 'Pilih rentang tanggal';

    const tabClass = (active: boolean) =>
        `flex items-center justify-center gap-2 rounded-sm border font-bold transition-all duration-300 ease-in-out ${
            compact ? 'px-2 py-1.5 text-xs' : 'px-3 py-3 text-sm'
        } ${
            active
                ? 'border-[#a9c8e0] bg-gradient-to-b from-[#fafdff] to-[#dfedf8] text-[#4b83ad] shadow-inner'
                : 'border-[#dce4ec] bg-gradient-to-b from-white to-[#f0f4f8] text-[#8296a9] hover:border-[#c5d9e9] hover:from-white hover:to-[#e8f0f7]'
        }`;

    const buttonClass =
        'rounded-sm border border-[#dce4ec] bg-gradient-to-b from-white to-[#f0f4f8] px-3 py-2 text-sm font-semibold text-[#6487a5] shadow-sm transition hover:from-white hover:to-[#e6eff7] active:translate-y-px';

    return (
        <>
            {/* Search Type */}
            <div className="grid grid-cols-2 gap-1 border-b border-[#dce4ec] bg-[#eaf0f6] p-1">
                <button
                    type="button"
                    onClick={() => setSearchType('keyword')}
                    className={tabClass(searchType === 'keyword')}
                >
                    <Search className="size-4" />
                    Keyword
                </button>

                <button
                    type="button"
                    onClick={() => setSearchType('category')}
                    className={tabClass(searchType === 'category')}
                >
                    <ListFilter className="size-4" />
                    Kategori
                </button>
            </div>

            {/* Keyword */}
            {searchType === 'keyword' ? (
                <div
                    className={`border-t border-white bg-[#fbfcfd] transition-[padding] duration-300 ease-in-out ${
                        compact ? 'p-2' : 'p-3'
                    }`}
                >
                    <div
                        className={`grid transition-all duration-300 ease-in-out ${
                            compact
                                ? 'grid-rows-[0fr] opacity-0'
                                : 'grid-rows-[1fr] opacity-100'
                        }`}
                    >
                        <div className="overflow-hidden">
                            <label className="mb-2 block text-xs font-bold text-[#566779]">
                                Kata kunci pencarian
                            </label>
                        </div>
                    </div>

                    {/* Search Input + Autocomplete */}
                    <div ref={searchRef} className="relative">
                        <div className="flex rounded-sm border border-[#d4e0eb] bg-white shadow-inner focus-within:border-[#a9c8e0] focus-within:ring-1 focus-within:ring-[#dcebf6]">
                            <div className="flex items-center border-r border-[#e2e8ef] bg-gradient-to-b from-white to-[#f0f4f8] px-3">
                                <Search className="size-4 text-[#91afc8]" />
                            </div>

                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => {
                                    if (keyword.trim().length >= 2) {
                                        setShowSuggestions(true);
                                    }
                                }}
                                onKeyDown={handleSuggestionKeyDown}
                                className={`min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-[#566779] transition-[height] duration-300 ease-in-out outline-none placeholder:text-[#aab6c2] focus:ring-0 ${
                                    compact ? 'h-8' : 'h-10'
                                }`}
                                placeholder="Nama produk atau kode produk..."
                                autoComplete="off"
                            />

                            {loadingSuggestions && (
                                <div className="flex items-center px-3">
                                    <Loader2 className="size-4 animate-spin text-[#91afc8]" />
                                </div>
                            )}

                            {keyword && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setKeyword('');
                                        setSuggestions([]);
                                        setShowSuggestions(false);
                                    }}
                                    className="flex items-center px-3 text-[#91a1b1] hover:text-[#6487a5]"
                                    aria-label="Hapus pencarian"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        {/* Autocomplete Dropdown */}
                        {showSuggestions && keyword.trim().length >= 2 && (
                            <div className="absolute top-full right-0 left-0 z-[60] mt-1 overflow-hidden rounded-sm border border-[#d4e0eb] bg-white shadow-[0_5px_18px_rgba(50,80,110,0.16)]">
                                {loadingSuggestions ? (
                                    <div className="flex items-center justify-center gap-2 px-3 py-5 text-xs text-[#8296a9]">
                                        <Loader2 className="size-4 animate-spin" />
                                        Mencari produk...
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    <>
                                        <div className="border-b border-[#e8edf2] bg-[#f7f9fb] px-3 py-2">
                                            <span className="text-[10px] font-bold tracking-wider text-[#91a1b1] uppercase">
                                                Rekomendasi produk
                                            </span>
                                        </div>

                                        <div className="max-h-72 overflow-y-auto">
                                            {suggestions.map((item, index) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onMouseDown={(e) =>
                                                        e.preventDefault()
                                                    }
                                                    onClick={() =>
                                                        selectSuggestion(item)
                                                    }
                                                    className={`flex w-full items-center gap-3 border-b border-[#edf1f5] px-3 py-2.5 text-left transition last:border-0 ${
                                                        activeSuggestion ===
                                                        index
                                                            ? 'bg-[#edf4fa]'
                                                            : 'bg-white hover:bg-[#f7f9fb]'
                                                    }`}
                                                >
                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-[#dce4ec] bg-gradient-to-b from-white to-[#edf3f8]">
                                                        <Search className="size-4 text-[#91afc8]" />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs font-semibold text-[#566779]">
                                                            {item.name}
                                                        </p>

                                                        {item.code && (
                                                            <p className="mt-0.5 text-[10px] text-[#91a1b1]">
                                                                Kode:{' '}
                                                                {item.code}
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="border-t border-[#e8edf2] bg-[#f7f9fb] px-3 py-1.5">
                                            <p className="text-[10px] text-[#91a1b1]">
                                                Gunakan ↑ ↓ untuk memilih dan
                                                Enter untuk menggunakan.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="px-3 py-5 text-center">
                                        <Search className="mx-auto mb-2 size-5 text-[#b5c3cf]" />

                                        <p className="text-xs font-semibold text-[#8296a9]">
                                            Produk tidak ditemukan
                                        </p>

                                        <p className="mt-1 text-[10px] text-[#aab6c2]">
                                            Coba kata kunci lainnya.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div
                        className={`grid transition-all duration-300 ease-in-out ${
                            compact
                                ? 'grid-rows-[0fr] opacity-0'
                                : 'grid-rows-[1fr] opacity-100'
                        }`}
                    >
                        <div className="overflow-hidden">
                            <p className="mt-2 text-[10px] text-[#91a1b1]">
                                Masukkan nama atau kode produk yang ingin
                                dicari.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Category */}
                    <div className="border-t border-white bg-[#fbfcfd]">
                        <div
                            className={`flex items-center justify-between border-b border-[#e2e8ef] bg-gradient-to-b from-white to-[#f5f8fb] px-3 transition-[padding] duration-300 ${
                                compact ? 'py-1.5' : 'py-2'
                            }`}
                        >
                            <p className="text-xs font-bold text-[#566779]">
                                Pilih kategori produk
                            </p>

                            <span className="rounded-sm border border-[#dce4ec] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#6487a5]">
                                {category.length} dipilih
                            </span>
                        </div>

                        <div
                            className={`thin-scrollbar flex gap-1.5 overflow-x-auto bg-white transition-[padding] duration-300 ${
                                compact ? 'p-2' : 'p-3'
                            }`}
                        >
                            {categories.map((item) => {
                                const active = category.includes(item.id);

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleCategory(item.id)}
                                        className={`shrink-0 rounded-sm border font-semibold shadow-sm transition-all duration-200 ${
                                            compact
                                                ? 'px-2 py-1 text-[10px]'
                                                : 'px-3 py-1.5 text-xs'
                                        } ${
                                            active
                                                ? 'border-[#e6c99f] bg-gradient-to-b from-[#fff9ef] to-[#f8ead5] text-[#986b37]'
                                                : 'border-[#dce4ec] bg-gradient-to-b from-white to-[#f0f4f8] text-[#8296a9] hover:border-[#c5d9e9] hover:to-[#e8f0f7]'
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Date Filter */}
                        <div
                            className={`relative border-t border-[#e2e8ef] bg-[#f7f9fb] transition-[padding] duration-300 ${
                                compact ? 'p-2' : 'p-3'
                            }`}
                        >
                            <div
                                className={`grid transition-all duration-300 ease-in-out ${
                                    compact
                                        ? 'grid-rows-[0fr] opacity-0'
                                        : 'grid-rows-[1fr] opacity-100'
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <label className="mb-2 block text-xs font-bold text-[#566779]">
                                        Filter tanggal
                                    </label>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCalendar((prev) => !prev)}
                                className={`flex w-full items-center gap-2 rounded-sm border border-[#d4e0eb] bg-white px-3 text-left text-sm text-[#6487a5] shadow-inner transition-all duration-300 hover:border-[#a9c8e0] ${
                                    compact ? 'h-8' : 'h-10'
                                }`}
                            >
                                <Calendar className="size-4 shrink-0 text-[#91afc8]" />

                                <span className="flex-1 truncate">
                                    {dateLabel}
                                </span>
                            </button>

                            {showCalendar && (
                                <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-sm border border-[#d4e0eb] bg-[#fbfcfd] p-3 shadow-[0_4px_12px_rgba(50,80,110,0.15)]">
                                    <div className="mb-2 border-b border-[#e2e8ef] pb-2 text-xs font-bold text-[#566779]">
                                        Pilih rentang tanggal
                                    </div>

                                    <DayPicker
                                        mode="range"
                                        selected={range}
                                        onSelect={handleDateSelect}
                                        locale={id}
                                        numberOfMonths={1}
                                        showOutsideDays
                                        className="w-full"
                                        classNames={{
                                            root: 'w-full',
                                            month: 'w-full',
                                            month_grid:
                                                'w-full table-fixed border-collapse',
                                            weekdays: 'w-full',
                                            weekday:
                                                'p-1 text-center text-xs font-bold text-[#91a1b1]',
                                            week: 'w-full',
                                            day: 'p-0 text-center',
                                            day_button:
                                                'mx-auto flex size-8 items-center justify-center rounded-sm border border-transparent text-sm text-[#566779] hover:border-[#c9dbea] hover:bg-[#edf4fa]',
                                            selected:
                                                'bg-gradient-to-b from-[#dcebf7] to-[#c5dced] text-[#426f94]',
                                            range_start:
                                                'rounded-sm bg-[#c5dced] text-[#426f94]',
                                            range_end:
                                                'rounded-sm bg-[#c5dced] text-[#426f94]',
                                            range_middle:
                                                'bg-[#edf4fa] text-[#6487a5]',
                                        }}
                                    />

                                    <div className="flex justify-end gap-2 border-t border-[#e2e8ef] pt-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDateSelect(undefined)
                                            }
                                            className={buttonClass}
                                        >
                                            Reset
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                !range?.from || !range?.to
                                            }
                                            onClick={() =>
                                                setShowCalendar(false)
                                            }
                                            className="rounded-sm border border-[#e6c99f] bg-gradient-to-b from-[#fff9ef] to-[#f8ead5] px-4 py-2 text-sm font-bold text-[#986b37] shadow-sm transition hover:from-[#fff4e4] hover:to-[#f4dfc1] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Terapkan
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
