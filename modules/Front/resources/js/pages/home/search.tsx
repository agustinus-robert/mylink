import React, { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Search, ListFilter, Calendar } from 'lucide-react';
import 'react-day-picker/style.css';

type Category = {
    id: number;
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
};

export default function Searching({
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
}: SearchingProps) {
    const [showCalendar, setShowCalendar] = useState(false);

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
        <div className="relative z-40 mx-2 mt-0 mb-2 max-w-100">
            <div
                className={`relative flex max-w-100 flex-col overflow-visible rounded-sm border border-[#d4e0eb] bg-[#f3f6fa] shadow-[0_2px_6px_rgba(50,80,110,0.08)] transition-shadow duration-300 ease-in-out ${
                    compact ? 'z-50 shadow-md' : ''
                }`}
            >
                {/* Header */}
                <div
                    className={`rounded-t-sm border-b border-[#c9dbea] bg-gradient-to-b from-[#fafdff] to-[#e5eff8] transition-[padding] duration-300 ease-in-out ${
                        compact ? 'px-3 py-1.5' : 'px-3 py-3'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3
                                className={`font-bold text-[#40566b] transition-all duration-300 ${
                                    compact ? 'text-xs' : 'text-sm'
                                }`}
                            >
                                Pencarian Produk
                            </h3>

                            <div
                                className={`grid transition-all duration-300 ease-in-out ${
                                    compact
                                        ? 'grid-rows-[0fr] opacity-0'
                                        : 'grid-rows-[1fr] opacity-100'
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <p className="mt-0.5 text-[11px] text-[#91a1b1]">
                                        Temukan produk yang Anda cari
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`flex shrink-0 items-center justify-center rounded-sm border border-[#d1e2f0] bg-gradient-to-b from-white to-[#e6f1fa] transition-all duration-300 ${
                                compact ? 'size-7' : 'size-9'
                            }`}
                        >
                            <Search
                                className={`text-[#5286b1] transition-all duration-300 ${
                                    compact ? 'size-4' : 'size-5'
                                }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Search type */}
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

                        <div className="flex rounded-sm border border-[#d4e0eb] bg-white shadow-inner focus-within:border-[#a9c8e0] focus-within:ring-1 focus-within:ring-[#dcebf6]">
                            <div className="flex items-center border-r border-[#e2e8ef] bg-gradient-to-b from-white to-[#f0f4f8] px-3">
                                <Search className="size-4 text-[#91afc8]" />
                            </div>

                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className={`min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-[#566779] transition-[height] duration-300 ease-in-out outline-none placeholder:text-[#aab6c2] focus:ring-0 ${
                                    compact ? 'h-8' : 'h-10'
                                }`}
                                placeholder="Nama produk atau kode produk..."
                            />
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
                )}

                {/* Footer */}
                <div
                    className={`grid transition-all duration-300 ease-in-out ${
                        compact
                            ? 'grid-rows-[0fr] opacity-0'
                            : 'grid-rows-[1fr] opacity-100'
                    }`}
                >
                    <div className="overflow-hidden">
                        <div className="flex items-center justify-between rounded-b-sm border-t border-[#dce4ec] bg-gradient-to-b from-white to-[#f0f4f8] px-3 py-2">
                            <span className="text-[10px] text-[#91a1b1]">
                                Sistem pencarian produk
                            </span>

                            <span className="text-[10px] font-semibold text-[#6d9a75]">
                                ● Siap mencari
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
