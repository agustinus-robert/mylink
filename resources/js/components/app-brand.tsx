import { ShoppingBag } from 'lucide-react';

export default function Brands() {
    return (
        <div className="w-full py-1">
            <div className="flex h-14 w-full items-center justify-between rounded-sm border border-[#DEDAD4] bg-gradient-to-b from-white to-[#F5F4F1] px-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-[#E66B0B] bg-[#F07818] shadow-sm">
                        <ShoppingBag className="size-4 text-white" />
                    </div>

                    <div>
                        <h2 className="text-base leading-tight font-bold tracking-tight text-[#292522]">
                            MyCatalog{' '}
                            <span className="text-[#F07818]">Wishlist</span>
                        </h2>

                        <p className="text-[10px] text-[#77716B]">
                            Selamat mencari barang yang Anda butuhkan
                        </p>
                    </div>
                </div>

                <div className="hidden rounded-sm border border-[#E66B0B] bg-[#F07818] px-2 py-1 text-[9px] font-bold tracking-wide text-white shadow-sm sm:block">
                    TEMUKAN FAVORITMU
                </div>
            </div>
        </div>
    );
}
