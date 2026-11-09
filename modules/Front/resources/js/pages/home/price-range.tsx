import { useState } from 'react';
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

    return (
        <div className="border-b border-[#dce4ec] bg-white px-3 py-3">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-[#5286b1]" />

                    <div>
                        <h3 className="text-xs font-bold text-[#40566b]">
                            Rentang Harga
                        </h3>
                        <p className="text-[10px] text-[#91a1b1]">
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
                        className="flex items-center gap-1 text-[10px] font-semibold text-[#c47770] hover:text-[#a95750]"
                    >
                        <RotateCcw className="size-3" />
                        Reset
                    </button>
                )}
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="mb-1 block text-[10px] font-semibold text-[#8296a9]">
                        Harga Minimum
                    </label>

                    <div className="flex h-10 items-center rounded-sm border border-[#dce4ec] bg-[#f8fafc] px-2 focus-within:border-[#a9c8e0]">
                        <span className="mr-1 text-xs text-[#91a1b1]">Rp</span>

                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatPrice(minPrice)}
                            onChange={(e) =>
                                setMinPrice(parsePrice(e.target.value))
                            }
                            placeholder="0"
                            className="w-full min-w-0 border-0 bg-transparent p-0 text-xs text-[#566779] outline-none focus:ring-0"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-[10px] font-semibold text-[#8296a9]">
                        Harga Maksimum
                    </label>

                    <div className="flex h-10 items-center rounded-sm border border-[#dce4ec] bg-[#f8fafc] px-2 focus-within:border-[#a9c8e0]">
                        <span className="mr-1 text-xs text-[#91a1b1]">Rp</span>

                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatPrice(maxPrice)}
                            onChange={(e) =>
                                setMaxPrice(parsePrice(e.target.value))
                            }
                            placeholder="Tidak terbatas"
                            className="w-full min-w-0 border-0 bg-transparent p-0 text-xs text-[#566779] outline-none focus:ring-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
