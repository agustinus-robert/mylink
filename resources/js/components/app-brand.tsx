import { ShoppingBag } from 'lucide-react';

export default function Brands() {
    return (
        <div className="w-full py-1">
            <div className="flex h-14 w-full items-center justify-between rounded-sm border border-[#d4e0eb] bg-gradient-to-b from-[#fafdff] to-[#e5eff8] px-3 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-[#d1e2f0] bg-white">
                        <ShoppingBag className="size-4 text-[#5286b1]" />
                    </div>

                    <div>
                        <h2 className="text-base leading-tight font-bold tracking-tight text-[#40566b]">
                            MyCatalog{' '}
                            <span className="text-[#c58b4d]">Wishlist</span>
                        </h2>

                        <p className="text-[10px] text-[#91a1b1]">
                            Selamat mencari barang yang Anda butuhkan
                        </p>
                    </div>
                </div>

                <div className="hidden rounded-sm border border-[#e6c99f] bg-[#fff5e6] px-2 py-1 text-[9px] font-bold tracking-wide text-[#a77a45] sm:block">
                    TEMUKAN FAVORITMU
                </div>
            </div>
        </div>
    );
}
