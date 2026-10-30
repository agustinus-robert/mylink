import { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Search, ListFilter, Calendar } from 'lucide-react';
import 'react-day-picker/style.css';

const categories = ['Komputer', 'Monitor', 'Penyimpanan', 'Mouse'];

export default function Searching() {
    const [range, setRange] = useState<DateRange | undefined>();
    const [showCalendar, setShowCalendar] = useState(false);
    const [activeTab, setActiveTab] = useState<'keyword' | 'category'>(
        'keyword',
    );

    const dateLabel = range?.from
        ? range.to
            ? `${format(range.from, 'dd/MM/yyyy')} – ${format(range.to, 'dd/MM/yyyy')}`
            : `${format(range.from, 'dd/MM/yyyy')} – Pilih tanggal akhir`
        : 'Pilih rentang tanggal';

    return (
        <div className="relative m-2 flex max-w-100 flex-col border bg-white">
            <div className="grid grid-cols-2 border-b border-gray-200">
                <button
                    type="button"
                    onClick={() => setActiveTab('keyword')}
                    className={`flex items-center justify-center gap-2 p-2 text-sm transition ${
                        activeTab === 'keyword'
                            ? 'border-b-2 border-blue-500 bg-blue-50 text-blue-700'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <Search className="size-4" />
                    Pencarian Keyword
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('category')}
                    className={`flex items-center justify-center gap-2 p-2 text-sm transition ${
                        activeTab === 'category'
                            ? 'border-b-2 border-blue-500 bg-blue-50 text-blue-700'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <ListFilter className="size-4" />
                    Pencarian Kategori
                </button>
            </div>

            <div className="relative p-2 pb-1">
                <Search className="absolute top-1/2 left-5 size-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    className="h-10 w-full rounded-md border border-gray-300 pr-3 pl-10 text-sm transition outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder={
                        activeTab === 'keyword'
                            ? 'Cari nama produk atau kode produk'
                            : 'Cari kategori produk'
                    }
                />
            </div>

            <div className="thin-scrollbar flex gap-2 overflow-x-auto px-2 py-1">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        className="shrink-0 rounded-md bg-gray-100 px-4 py-1.5 text-sm text-gray-700 transition hover:bg-gray-200"
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="p-2 pt-1">
                <button
                    type="button"
                    onClick={() => setShowCalendar((prev) => !prev)}
                    className="flex h-10 w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-left text-sm text-gray-700 transition hover:border-blue-500"
                >
                    <Calendar className="size-4 shrink-0 text-gray-500" />
                    <span className="flex-1 truncate">{dateLabel}</span>
                </button>

                {showCalendar && (
                    <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                        <DayPicker
                            mode="range"
                            selected={range}
                            onSelect={setRange}
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
                                    'p-0 text-center text-xs font-normal text-gray-500',
                                week: 'w-full',
                                day: 'p-0 text-center',
                                day_button:
                                    'mx-auto flex size-8 items-center justify-center rounded-md text-sm hover:bg-gray-100',
                                selected: 'bg-blue-600 text-white',
                                range_start:
                                    'rounded-l-md bg-blue-600 text-white',
                                range_end:
                                    'rounded-r-md bg-blue-600 text-white',
                                range_middle: 'bg-blue-100 text-blue-900',
                            }}
                        />

                        <div className="flex justify-end gap-2 border-t border-gray-200 pt-3">
                            <button
                                type="button"
                                onClick={() => setRange(undefined)}
                                className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                            >
                                Reset
                            </button>

                            <button
                                type="button"
                                disabled={!range?.from || !range?.to}
                                onClick={() => setShowCalendar(false)}
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Terapkan
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
