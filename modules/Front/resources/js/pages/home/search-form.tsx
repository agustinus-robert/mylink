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

    const [inputKeyword, setInputKeyword] = useState(() => {
        const params = new URLSearchParams(window.location.search);

        return params.get('keyword') ?? keyword;
    });

    // Autocomplete
    const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);

    const searchRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestRef = useRef<AbortController | null>(null);
    const selectedKeywordRef = useRef(false);

    // Sinkronisasi keyword dari URL dengan state parent
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const urlKeyword = params.get('keyword');
        const urlSearchType = params.get('searchType');

        if (urlKeyword !== null) {
            setInputKeyword(urlKeyword);
            setKeyword(urlKeyword);
        }

        if (urlSearchType === 'keyword' || urlKeyword !== null) {
            setSearchType('keyword');
        }
    }, []);

    // Sinkronisasi jika keyword parent berubah dari luar komponen
    useEffect(() => {
        setInputKeyword(keyword);
    }, [keyword]);

    // Request autocomplete
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        requestRef.current?.abort();

        if (selectedKeywordRef.current) {
            selectedKeywordRef.current = false;
            setLoadingSuggestions(false);
            return;
        }

        if (searchType !== 'keyword' || inputKeyword.trim().length < 2) {
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
                    `/autocomplete/products?keyword=${encodeURIComponent(inputKeyword.trim())}`,
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
    }, [inputKeyword, searchType]);

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

        setInputKeyword(item.name);
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
        `flex items-center justify-center gap-2 rounded-sm border font-bold transition-all duration-200 ${
            compact ? 'px-2 py-1.5 text-xs' : 'px-3 py-3 text-sm'
        } ${
            active
                ? 'border-blue-400 bg-blue-500 text-white shadow-sm'
                : 'border-[#DEDAD4] bg-white text-[#625B54] hover:border-blue-500 hover:text-blue-500'
        }`;

    const buttonClass =
        'rounded-sm border border-[#DEDAD4] bg-white px-3 py-2 text-sm font-semibold text-[#625B54] shadow-sm transition hover:border-[#F07818] hover:text-[#D9630B] active:translate-y-px';

    return (
        <>
            {/* Search Type */}
            <div className="grid grid-cols-2 gap-1 border-b border-[#DEDAD4] bg-[#F0EEEA] p-1">
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
                    className={`border-t border-white bg-white transition-[padding] duration-300 ease-in-out ${
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
                            <label className="mb-2 block text-xs font-bold text-[#292522]">
                                Kata kunci pencarian
                            </label>
                        </div>
                    </div>

                    {/* Search Input + Autocomplete */}
                    <div ref={searchRef} className="relative">
                        <div className="flex rounded-sm border border-[#DAD5CE] bg-white shadow-inner transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30">
                            <div className="flex items-center border-r border-[#DEDAD4] bg-[#F5F4F1] px-3">
                                <Search className="size-4 text-blue-500" />
                            </div>

                            <input
                                type="text"
                                value={inputKeyword}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setInputKeyword(value);
                                    setKeyword(value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => {
                                    if (inputKeyword.trim().length >= 2) {
                                        setShowSuggestions(true);
                                    }
                                }}
                                onKeyDown={handleSuggestionKeyDown}
                                className={`min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-[#292522] transition-[height] duration-300 ease-in-out outline-none placeholder:text-[#A39B92] focus:ring-0 ${
                                    compact ? 'h-8' : 'h-10'
                                }`}
                                placeholder="Nama produk atau kode produk..."
                                autoComplete="off"
                            />

                            {loadingSuggestions && (
                                <div className="flex items-center px-3">
                                    <Loader2 className="size-4 animate-spin text-[#F07818]" />
                                </div>
                            )}

                            {inputKeyword && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setInputKeyword('');
                                        setKeyword('');
                                        setSuggestions([]);
                                        setShowSuggestions(false);
                                    }}
                                    className="flex items-center px-3 text-[#888078] transition hover:text-[#E66B0B]"
                                    aria-label="Hapus pencarian"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        {/* Autocomplete Dropdown */}
                        {showSuggestions && inputKeyword.trim().length >= 2 && (
                            <div className="absolute top-full right-0 left-0 z-[60] mt-1 overflow-hidden rounded-sm border border-[#DEDAD4] bg-white shadow-[0_5px_18px_rgba(40,30,20,0.15)]">
                                {loadingSuggestions ? (
                                    <div className="flex items-center justify-center gap-2 px-3 py-5 text-xs text-[#77716B]">
                                        <Loader2 className="size-4 animate-spin text-[#F07818]" />
                                        Mencari produk...
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    <>
                                        <div className="border-b border-[#DEDAD4] bg-[#F5F4F1] px-3 py-2">
                                            <span className="text-[10px] font-bold tracking-wider text-[#77716B] uppercase">
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
                                                    className={`flex w-full items-center gap-3 border-b border-[#F0EEEA] px-3 py-2.5 text-left transition last:border-0 ${
                                                        activeSuggestion ===
                                                        index
                                                            ? 'bg-[#FFF0E2]'
                                                            : 'bg-white hover:bg-[#FFF7F0]'
                                                    }`}
                                                >
                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-[#F07818] bg-[#F07818]">
                                                        <Search className="size-4 text-white" />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs font-semibold text-[#292522]">
                                                            {item.name}
                                                        </p>

                                                        {item.code && (
                                                            <p className="mt-0.5 text-[10px] text-[#77716B]">
                                                                Kode:{' '}
                                                                {item.code}
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="border-t border-[#DEDAD4] bg-[#F5F4F1] px-3 py-1.5">
                                            <p className="text-[10px] text-[#77716B]">
                                                Gunakan ↑ ↓ untuk memilih dan
                                                Enter untuk menggunakan.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="px-3 py-5 text-center">
                                        <Search className="mx-auto mb-2 size-5 text-[#F07818]" />

                                        <p className="text-xs font-semibold text-[#292522]">
                                            Produk tidak ditemukan
                                        </p>

                                        <p className="mt-1 text-[10px] text-[#77716B]">
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
                            <p className="mt-2 text-[10px] text-[#77716B]">
                                Masukkan nama atau kode produk yang ingin
                                dicari.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Category */}
                    <div className="border-t border-white bg-white">
                        <div
                            className={`flex items-center justify-between border-b border-[#DEDAD4] bg-[#F5F4F1] px-3 transition-[padding] duration-300 ${
                                compact ? 'py-1.5' : 'py-2'
                            }`}
                        >
                            <p className="text-xs font-bold text-[#292522]">
                                Pilih kategori produk
                            </p>

                            <span className="rounded-sm border border-blue-400 bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">
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
                                        className={`shrink-0 rounded-sm border font-bold shadow-sm transition-all duration-200 ${
                                            compact
                                                ? 'px-2 py-1 text-[10px]'
                                                : 'px-3 py-1.5 text-xs'
                                        } ${
                                            active
                                                ? 'border-blue-400 bg-blue-500 text-white'
                                                : 'border-blue-400 bg-white text-blue-400 hover:border-blue-400 hover:text-blue-500'
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Date Filter */}
                        <div
                            className={`relative border-t border-[#DEDAD4] bg-[#F5F4F1] transition-[padding] duration-300 ${
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
                                    <label className="mb-2 block text-xs font-bold text-[#292522]">
                                        Filter tanggal
                                    </label>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCalendar((prev) => !prev)}
                                className={`flex w-full items-center gap-2 rounded-sm border border-[#DAD5CE] bg-white px-3 text-left text-sm text-[#625B54] shadow-inner transition-all duration-300 hover:border-blue-500 ${
                                    compact ? 'h-8' : 'h-10'
                                }`}
                            >
                                <Calendar className="size-4 shrink-0 text-blue-500" />

                                <span className="flex-1 truncate">
                                    {dateLabel}
                                </span>
                            </button>

                            {showCalendar && (
                                <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-sm border border-[#DEDAD4] bg-white p-3 shadow-[0_4px_12px_rgba(40,30,20,0.15)]">
                                    <div className="mb-2 border-b border-[#DEDAD4] pb-2 text-xs font-bold text-[#292522]">
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
                                                'p-1 text-center text-xs font-bold text-[#77716B]',
                                            week: 'w-full',
                                            day: 'p-0 text-center',
                                            day_button:
                                                'mx-auto flex size-8 items-center justify-center rounded-sm border border-transparent text-sm text-[#292522] hover:border-[#F07818] hover:bg-[#FFF0E2]',
                                            selected:
                                                'bg-[#FFE0C5] text-[#A94F08]',
                                            range_start:
                                                'rounded-sm bg-[#F07818] text-white',
                                            range_end:
                                                'rounded-sm bg-[#F07818] text-white',
                                            range_middle:
                                                'bg-[#FFF0E2] text-[#A94F08]',
                                        }}
                                    />

                                    <div className="flex justify-end gap-2 border-t border-[#DEDAD4] pt-3">
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
                                            className="rounded-sm border border-[#D9630B] bg-[#F07818] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#D9630B] disabled:cursor-not-allowed disabled:opacity-50"
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
