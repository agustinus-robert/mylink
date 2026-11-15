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
        'w-full min-w-0 border-0 bg-transparent p-0 text-xs text-[#665548] outline-none placeholder:text-[#B5A99D] focus:ring-0';

    return (
        <div className="border-b border-[#EAE2D9] bg-white px-3 py-3">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-sm border border-[#E8C3A3] bg-[#FFF1E5]">
                        <SlidersHorizontal className="size-4 text-[#C4773D]" />
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-[#665548]">
                            Rentang Harga
                        </h3>

                        <p className="text-[10px] text-[#A99B8D]">
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
                        className="flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-semibold text-[#C4773D] transition hover:bg-[#FFF1E5] hover:text-[#A95E2D]"
                    >
                        <RotateCcw className="size-3" />
                        Reset
                    </button>
                )}
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="mb-1.5 block text-[10px] font-semibold text-[#928477]">
                        Harga Minimum
                    </label>

                    <div className="flex h-10 items-center rounded-sm border border-[#EAE2D9] bg-[#FAF8F5] px-2 transition focus-within:border-[#D69B70] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#F5DCC7]">
                        <span className="mr-2 text-xs font-semibold text-[#C4773D]">
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
                    <label className="mb-1.5 block text-[10px] font-semibold text-[#928477]">
                        Harga Maksimum
                    </label>

                    <div className="flex h-10 items-center rounded-sm border border-[#EAE2D9] bg-[#FAF8F5] px-2 transition focus-within:border-[#D69B70] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#F5DCC7]">
                        <span className="mr-2 text-xs font-semibold text-[#C4773D]">
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
                    <span className="size-1.5 rounded-full bg-[#C4773D]" />

                    <span className="text-[10px] text-[#A99B8D]">
                        Filter harga aktif
                    </span>
                </div>
            )}
        </div>
    );
}
