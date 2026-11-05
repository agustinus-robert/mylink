import { ShoppingBag } from 'lucide-react';

export default function Brands() {
    return (
        <div className="p-2">
            <div className="flex h-20 max-w-200 items-center justify-between rounded-sm border border-[#d4e0eb] bg-gradient-to-b from-[#fafdff] to-[#e5eff8] px-4 shadow-[0_2px_6px_rgba(50,80,110,0.08)]">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-sm border border-[#d1e2f0] bg-gradient-to-b from-white to-[#e6f1fa]">
                            <ShoppingBag className="size-5 text-[#5286b1]" />
                        </div>

                        <h2 className="text-lg font-bold tracking-tight text-[#40566b]">
                            MyCatalog{' '}
                            <span className="text-[#c58b4d]">Wishlist</span>
                        </h2>
                    </div>

                    <p className="mt-1 text-xs text-[#91a1b1]">
                        Selamat mencari barang yang Anda butuhkan
                    </p>
                </div>

                <div className="hidden rounded-sm border border-[#e6c99f] bg-gradient-to-b from-[#fff9ef] to-[#f8ead5] px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#a77a45] shadow-sm sm:block">
                    TEMUKAN FAVORITMU
                </div>
            </div>
        </div>
    );
}
