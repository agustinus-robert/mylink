import { ShoppingBag } from 'lucide-react';

export default function Brands() {
    return (
        <div className="w-full py-1">
            <div className="flex h-14 w-full items-center justify-between rounded-sm border border-[#EAE2D9] bg-gradient-to-b from-white to-[#F7F3EE] px-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-[#E8C3A3] bg-[#FFF8F0]">
                        <ShoppingBag className="size-4 text-[#C4773D]" />
                    </div>

                    <div>
                        <h2 className="text-base leading-tight font-bold tracking-tight text-[#665548]">
                            MyCatalog{' '}
                            <span className="text-[#C4773D]">Wishlist</span>
                        </h2>

                        <p className="text-[10px] text-[#A99B8D]">
                            Selamat mencari barang yang Anda butuhkan
                        </p>
                    </div>
                </div>

                <div className="hidden rounded-sm border border-[#E8C3A3] bg-[#FFF1E5] px-2 py-1 text-[9px] font-bold tracking-wide text-[#B66B35] sm:block">
                    TEMUKAN FAVORITMU
                </div>
            </div>
        </div>
    );
}
