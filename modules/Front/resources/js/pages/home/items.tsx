import { InfiniteScroll } from '@inertiajs/react';
import { Hand, ShoppingBag } from 'lucide-react';

type Product = {
    id: number;
    name: string;
    link: string;
    affiliate_link: string;
    detail: {
        prices: number;
    } | null;
};

type Props = {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total: number;
    };
};

export default function Items({ products }: Props) {
    return (
        <div className="flex w-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#dce4ec] bg-white px-3 py-2">
                <div className="flex items-center gap-2">
                    <Hand className="size-4 text-[#5286b1]" />

                    <div>
                        <h3 className="text-xs font-bold text-[#40566b]">
                            Barang Terbaru
                        </h3>
                        <p className="text-[10px] text-[#91a1b1]">
                            Temukan barang pilihan
                        </p>
                    </div>
                </div>

                <span className="text-[10px] font-bold text-[#6487a5]">
                    {products.total.toLocaleString('id-ID')} PRODUK
                </span>
            </div>

            {/* Product List */}
            <div className="px-2 py-2">
                <InfiniteScroll
                    data="products"
                    onlyNext
                    buffer={300}
                    className="grid min-h-[500px] auto-rows-max grid-cols-2 content-start items-start gap-2"
                >
                    {products.data.map((item) => (
                        <a
                            href={item.affiliate_link || item.link}
                            key={item.id}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex h-auto min-w-0 flex-col self-start overflow-hidden rounded-sm border border-[#dce4ec] bg-white shadow-[0_1px_3px_rgba(50,80,110,0.05)] transition hover:border-[#a9c8e0] hover:shadow-sm"
                        >
                            {/* Image */}
                            <div className="relative h-32 w-full shrink-0 overflow-hidden border-b border-[#e8edf2] bg-[#f0f3f6]">
                                {item.link ? (
                                    <img
                                        src={item.link}
                                        alt={item.name}
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                        className="block h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-1 text-[10px] text-[#a1afbd]">
                                        <ShoppingBag className="size-6 text-[#b7c8d8]" />
                                        Gambar tidak tersedia
                                    </div>
                                )}

                                <span className="absolute top-1.5 left-0 rounded-r-sm bg-gradient-to-b from-[#e98b86] to-[#d66d68] px-1.5 py-0.5 text-[8px] font-bold text-white">
                                    BARU
                                </span>
                            </div>

                            {/* Product Info */}
                            <div className="flex min-h-[90px] w-full flex-col bg-gradient-to-b from-white to-[#fbfcfd] p-1.5">
                                <p className="mb-1 text-xs font-bold text-[#d46f69]">
                                    {item.detail?.prices != null
                                        ? `Rp ${Number(item.detail.prices).toLocaleString('id-ID')}`
                                        : 'Harga belum tersedia'}
                                </p>

                                <h4 className="line-clamp-2 min-h-8 text-[11px] leading-4 text-[#566779] transition group-hover:text-[#4b83ad]">
                                    {item.name}
                                </h4>

                                <div className="mt-auto border-t border-dashed border-[#e2e8ef] pt-1.5">
                                    <span className="flex items-center justify-center gap-1 rounded-sm border border-[#e6b98d] bg-gradient-to-b from-[#fff5e9] to-[#f8dfc4] px-1.5 py-1 text-[9px] font-bold text-[#a86d39] transition group-hover:to-[#f4d1ad]">
                                        <ShoppingBag className="size-3" />
                                        LIHAT PRODUK
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </InfiniteScroll>

                {/* Empty State */}
                {products.data.length === 0 && (
                    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-sm border border-dashed border-[#d5e0e9] bg-white">
                        <ShoppingBag className="mb-2 size-7 text-[#91afc8]" />
                        <p className="text-xs text-[#91a1b1]">
                            Belum ada barang ditemukan.
                        </p>
                    </div>
                )}

                {/* Total */}
                <div className="mt-2 flex items-center justify-between border-t border-[#dce4ec] px-2 py-2">
                    <span className="text-[10px] font-semibold text-[#91a1b1]">
                        TOTAL BARANG DITEMUKAN
                    </span>

                    <span className="text-xs font-bold text-[#6487a5]">
                        {products.total.toLocaleString('id-ID')} produk
                    </span>
                </div>
            </div>
        </div>
    );
}
