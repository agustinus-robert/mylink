import { Hand, ShoppingBag } from 'lucide-react';

type Products = {
    id: number;
    name: string;
    link: string;
    affiliate_link: string;
    detail: {
        prices: number;
    } | null;
};

type Props = {
    products: Products[];
};

export default function Items({ products }: Props) {
    return (
        <div className="m-2 flex h-[600px] max-w-100 flex-col rounded-sm border border-[#d4e0eb] bg-[#f3f6fa] p-2 shadow-[0_2px_6px_rgba(50,80,110,0.08)]">
            <div className="mb-3 flex shrink-0 items-center justify-between rounded-sm border border-[#c9dbea] bg-gradient-to-b from-[#fafdff] to-[#e5eff8] px-3 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-sm border border-[#d1e2f0] bg-gradient-to-b from-white to-[#e6f1fa]">
                        <Hand className="size-5 text-[#5286b1]" />
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-[#40566b]">
                            Barang Terbaru
                        </h3>
                        <p className="text-[10px] text-[#91a1b1]">
                            Temukan barang pilihan
                        </p>
                    </div>
                </div>

                <span className="rounded-sm border border-[#c9dbea] bg-white px-2 py-1 text-[10px] font-bold text-[#6487a5] shadow-sm">
                    {products.length} PRODUK
                </span>
            </div>

            <div
                scroll-region
                className="thin-scrollbar grid min-h-0 flex-1 grid-cols-2 content-start gap-2 overflow-y-auto"
            >
                {products.map((item) => (
                    <a
                        href={item.affiliate_link}
                        key={item.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-w-0 flex-col overflow-hidden rounded-sm border border-[#dce4ec] bg-white shadow-[0_1px_3px_rgba(50,80,110,0.05)] transition hover:border-[#a9c8e0] hover:shadow-[0_3px_8px_rgba(50,80,110,0.12)]"
                    >
                        <div className="relative h-40 w-full overflow-hidden border-b border-[#e8edf2] bg-[#f0f3f6]">
                            {item.link ? (
                                <img
                                    src={item.link}
                                    alt={item.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-2 text-xs text-[#a1afbd]">
                                    <ShoppingBag className="size-8 text-[#b7c8d8]" />
                                    Gambar tidak tersedia
                                </div>
                            )}

                            <span className="absolute top-2 left-0 rounded-r-sm bg-gradient-to-b from-[#e98b86] to-[#d66d68] px-2 py-1 text-[9px] font-bold text-white shadow-sm">
                                BARU
                            </span>
                        </div>

                        <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-[#fbfcfd] p-2">
                            <p className="mb-1 text-sm font-bold text-[#d46f69]">
                                {item.detail?.prices != null
                                    ? `Rp ${Number(item.detail.prices).toLocaleString('id-ID')}`
                                    : 'Harga belum tersedia'}
                            </p>

                            <h4 className="line-clamp-2 min-h-9 text-xs leading-5 text-[#566779] transition group-hover:text-[#4b83ad]">
                                {item.name}
                            </h4>

                            <div className="mt-auto border-t border-dashed border-[#e2e8ef] pt-2">
                                <span className="flex items-center justify-center gap-1 rounded-sm border border-[#e6b98d] bg-gradient-to-b from-[#fff5e9] to-[#f8dfc4] px-2 py-1.5 text-[10px] font-bold text-[#a86d39] shadow-sm transition group-hover:from-[#ffedda] group-hover:to-[#f4d1ad]">
                                    <ShoppingBag className="size-3" />
                                    LIHAT PRODUK
                                </span>
                            </div>
                        </div>
                    </a>
                ))}

                {products.length === 0 && (
                    <div className="col-span-2 flex flex-col items-center justify-center rounded-sm border border-dashed border-[#d5e0e9] bg-white py-16">
                        <div className="mb-2 flex size-12 items-center justify-center rounded-sm border border-[#dce7f0] bg-gradient-to-b from-white to-[#edf3f8]">
                            <ShoppingBag className="size-6 text-[#91afc8]" />
                        </div>

                        <p className="text-xs text-[#91a1b1]">
                            Belum ada barang ditemukan.
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-2 flex shrink-0 justify-between rounded-sm border border-[#dce4ec] bg-gradient-to-b from-white to-[#f0f4f8] px-2 py-2 text-[10px] text-[#91a1b1]">
                <span>Katalog Produk</span>
                <span className="font-semibold text-[#6487a5]">
                    {products.length} barang ditemukan
                </span>
            </div>
        </div>
    );
}
