import { SlidersHorizontal, RotateCcw } from 'lucide-react';

type Props = {
    minPrice: string;
    maxPrice: string;
    setMinPrice: (value: string) => void;
    setMaxPrice: (value: string) => void;
};

export default function PriceRange({
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
}: Props) {
    const formatPrice = (value: string) => {
        if (!value) return '';
        return Number(value).toLocaleString('id-ID');
    };

    const parsePrice = (value: string) => {
        return value.replace(/\D/g, '');
    };

    const hasFilter = minPrice !== '' || maxPrice !== '';

    const inputClass =
        'w-full min-w-0 border-0 bg-transparent p-0 text-xs font-medium text-[#292522] outline-none placeholder:text-[#A39B92] focus:ring-0';

    return (
        <div className="border-b border-[#DEDAD4] bg-white px-3 py-3">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-sm border border-blue-400 bg-blue-500 shadow-sm">
                        <SlidersHorizontal className="size-4 text-white" />
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-[#292522]">
                            Rentang Harga
                        </h3>

                        <p className="text-[10px] text-[#77716B]">
                            Tentukan batas harga produk
                        </p>
                    </div>
                </div>

                {hasFilter && (
                    <button
                        type="button"
                        onClick={() => {
                            setMinPrice('');
                            setMaxPrice('');
                        }}
                        className="flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-bold text-[#E66B0B] transition hover:bg-[#FFF0E2] hover:text-[#D9630B]"
                    >
                        <RotateCcw className="size-3" />
                        Reset
                    </button>
                )}
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-[#625B54]">
                        Harga Minimum
                    </label>

                    <div className="flex h-10 items-center rounded-sm border border-[#DEDAD4] bg-[#F5F4F1] px-2 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#F07818]/30">
                        <span className="mr-2 text-xs font-bold text-blue-400">
                            Rp
                        </span>

                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatPrice(minPrice)}
                            onChange={(e) =>
                                setMinPrice(parsePrice(e.target.value))
                            }
                            placeholder="0"
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-[#625B54]">
                        Harga Maksimum
                    </label>

                    <div className="flex h-10 items-center rounded-sm border border-[#DEDAD4] bg-[#F5F4F1] px-2 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#F07818]/30">
                        <span className="mr-2 text-xs font-bold text-blue-500">
                            Rp
                        </span>

                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatPrice(maxPrice)}
                            onChange={(e) =>
                                setMaxPrice(parsePrice(e.target.value))
                            }
                            placeholder="Tidak terbatas"
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>

            {/* Active Filter Indicator */}
            {hasFilter && (
                <div className="mt-2 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#F07818]" />

                    <span className="text-[10px] font-semibold text-[#77716B]">
                        Filter harga aktif
                    </span>
                </div>
            )}
        </div>
    );
}
