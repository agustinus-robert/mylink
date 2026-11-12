import { useEffect, useState } from 'react';
import { InfiniteScroll, router, usePage } from '@inertiajs/react';
import {
    Hand,
    Check,
    ShoppingBag,
    ArrowDownWideNarrow,
    ArrowUpWideNarrow,
    X,
    ExternalLink,
    Layers3,
    Sparkles,
    CheckCircle2,
    MapPin,
    Filter,
} from 'lucide-react';

type Product = {
    id: number;
    name: string;
    link: string;
    affiliate_link: string;
    related: string | null;
    similarity?: number;
    detail: {
        prices: number;
        location?: {
            district?: {
                city_name: string;
                type: string;
            } | null;
        } | null;
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

type RelatedGroup = {
    data: Product[];
    total: number;
};

type RelatedResponse = {
    identical: RelatedGroup;
    recommended: RelatedGroup;
};

type ProductGroupProps = {
    title: string;
    description: string;
    products: Product[];
    total: number;
    loading: boolean;
    icon: React.ReactNode;
    type: 'identical' | 'recommended';
};

// Mengambil nama kota/kabupaten dari relasi produk.
function getProductCity(item: Product): string | null {
    const district = item.detail?.location?.district;

    if (!district?.city_name) {
        return null;
    }

    return `${district.type || 'Kota'} ${district.city_name}`;
}

// Tampilan harga dan lokasi.
function ProductPrice({ item }: { item: Product }) {
    const city = getProductCity(item);

    return (
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-xs font-bold text-[#d46f69]">
                {item.detail?.prices != null
                    ? `Rp ${Number(item.detail.prices).toLocaleString('id-ID')}`
                    : 'Harga belum tersedia'}
            </p>

            {city && (
                <span className="inline-flex min-w-0 items-center gap-0.5 text-[9px] font-medium text-[#8295a7]">
                    <MapPin className="size-3 shrink-0 text-[#7b9bb7]" />
                    <span className="truncate">{city}</span>
                </span>
            )}
        </div>
    );
}

function ProductGroup({
    title,
    description,
    products,
    total,
    loading,
    icon,
    type,
}: ProductGroupProps) {
    const isIdentical = type === 'identical';

    return (
        <section className="mb-4 overflow-hidden rounded-sm border border-[#dce4ec] bg-white">
            {/* Group Header */}
            <div className="flex items-center justify-between border-b border-[#e2e8ef] bg-gradient-to-b from-white to-[#f5f8fb] px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                    <div
                        className={`flex size-7 shrink-0 items-center justify-center rounded-sm border ${
                            isIdentical
                                ? 'border-[#b9dfc9] bg-[#edf8f1] text-[#579875]'
                                : 'border-[#c5d9eb] bg-[#edf4fa] text-[#6487a5]'
                        }`}
                    >
                        {icon}
                    </div>

                    <div className="min-w-0">
                        <h4 className="text-[10px] font-bold text-[#40566b]">
                            {title}
                        </h4>

                        <p className="text-[9px] text-[#91a1b1]">
                            {description}
                        </p>
                    </div>
                </div>

                <span
                    className={`shrink-0 rounded-sm px-2 py-1 text-[9px] font-bold ${
                        isIdentical
                            ? 'bg-[#edf8f1] text-[#579875]'
                            : 'bg-[#eaf1f7] text-[#6487a5]'
                    }`}
                >
                    {loading ? 'MEMUAT...' : `${total} PRODUK`}
                </span>
            </div>

            {/* Product Grid */}
            <div className="p-2">
                {loading ? (
                    <div className="flex min-h-[120px] flex-col items-center justify-center">
                        <div className="mb-2 size-6 animate-spin rounded-full border-2 border-[#dce4ec] border-t-[#5286b1]" />

                        <p className="text-[10px] text-[#91a1b1]">
                            Mencari produk...
                        </p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {products.map((item) => (
                            <div
                                key={item.id}
                                className="group flex min-w-0 flex-col overflow-hidden rounded-sm border border-[#dce4ec] bg-white transition hover:border-[#a9c8e0] hover:shadow-sm"
                            >
                                {/* Image */}
                                <div className="relative h-28 overflow-hidden border-b border-[#e8edf2] bg-[#f0f3f6]">
                                    {item.link ? (
                                        <img
                                            src={item.link}
                                            alt={item.name}
                                            loading="lazy"
                                            referrerPolicy="no-referrer"
                                            className="size-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center">
                                            <ShoppingBag className="size-7 text-[#b7c8d8]" />
                                        </div>
                                    )}

                                    {item.similarity != null && (
                                        <span
                                            className={`absolute top-1.5 left-1.5 rounded-sm px-1.5 py-1 text-[9px] font-bold shadow-sm ${
                                                isIdentical
                                                    ? 'bg-[#e5f5eb] text-[#438663]'
                                                    : 'bg-[#eaf1f7] text-[#527fa4]'
                                            }`}
                                        >
                                            {item.similarity}% MIRIP
                                        </span>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-1 flex-col p-2">
                                    <ProductPrice item={item} />

                                    <h4 className="mb-2 line-clamp-3 min-h-[48px] text-[10px] leading-4 text-[#566779]">
                                        {item.name}
                                    </h4>

                                    <a
                                        href={item.affiliate_link || item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto flex items-center justify-center gap-1 rounded-sm border border-[#e6b98d] bg-gradient-to-b from-[#fff5e9] to-[#f8dfc4] px-1 py-1.5 text-[9px] font-bold text-[#a86d39] transition hover:to-[#f4d1ad]"
                                    >
                                        <ExternalLink className="size-3" />
                                        LIHAT PRODUK
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[100px] flex-col items-center justify-center text-center">
                        <ShoppingBag className="mb-2 size-6 text-[#b7c8d8]" />

                        <p className="text-[10px] font-bold text-[#566779]">
                            Belum ada produk ditemukan
                        </p>

                        <p className="mt-1 text-[9px] text-[#91a1b1]">
                            Belum ditemukan produk dalam kelompok ini.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function Items({ products }: Props) {
    const { url } = usePage();

    const [productsLoading, setProductsLoading] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );

    const [identicalProducts, setIdenticalProducts] = useState<Product[]>([]);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>(
        [],
    );

    const [identicalTotal, setIdenticalTotal] = useState(0);
    const [recommendedTotal, setRecommendedTotal] = useState(0);

    const [relatedLoading, setRelatedLoading] = useState(false);
    const [relatedError, setRelatedError] = useState<string | null>(null);

    const currentUrl = new URL(url, window.location.origin);

    // Sorting.
    const sort = currentUrl.searchParams.get('sort') || 'desc';

    // Status filter related dari URL.
    const relatedFilter = currentUrl.searchParams.get('related') === '1';

    // Mengaktifkan / menonaktifkan filter related.
    const handleRelatedFilter = () => {
        if (productsLoading) return;

        const params = new URLSearchParams(currentUrl.search);

        if (relatedFilter) {
            params.delete('related');
        } else {
            params.set('related', '1');
        }

        params.delete('page');

        // Tampilkan loader sebelum request.
        setProductsLoading(true);

        router.get(
            `${currentUrl.pathname}?${params.toString()}`,
            {},
            {
                only: ['products', 'relatedFilter'],
                reset: ['products'],
                preserveState: true,
                preserveScroll: false,
                replace: true,
                onFinish: () => {
                    setProductsLoading(false);
                },
            },
        );
    };

    // Sorting tetap mempertahankan seluruh filter aktif.
    const handleSort = () => {
        if (productsLoading) return;

        const nextSort = sort === 'desc' ? 'asc' : 'desc';

        const params = new URLSearchParams(currentUrl.search);

        params.set('sort', nextSort);
        params.delete('page');

        // Tampilkan loader sebelum request.
        setProductsLoading(true);

        router.get(
            `${currentUrl.pathname}?${params.toString()}`,
            {},
            {
                only: ['products', 'relatedFilter'],
                reset: ['products'],
                preserveState: true,
                preserveScroll: false,
                replace: true,
                onFinish: () => {
                    setProductsLoading(false);
                },
            },
        );
    };

    // Mengambil produk identik dan rekomendasi dari Laravel.
    useEffect(() => {
        if (!selectedProduct) {
            setIdenticalProducts([]);
            setRecommendedProducts([]);
            setIdenticalTotal(0);
            setRecommendedTotal(0);
            setRelatedError(null);
            setRelatedLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchRelatedProducts = async () => {
            setRelatedLoading(true);
            setRelatedError(null);

            setIdenticalProducts([]);
            setRecommendedProducts([]);
            setIdenticalTotal(0);
            setRecommendedTotal(0);

            const requestUrl = `/related-products?product=${selectedProduct.id}`;

            console.group('========== RELATED PRODUCT DEBUG ==========');
            console.log('Selected Product ID:', selectedProduct.id);
            console.log('Selected Product Name:', selectedProduct.name);
            console.log('Selected Product Related:', selectedProduct.related);
            console.log('Request URL:', requestUrl);
            console.groupEnd();

            try {
                const response = await fetch(requestUrl, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    signal: controller.signal,
                });

                console.group('========== RELATED API RESPONSE ==========');

                console.log('HTTP Status:', response.status);
                console.log('Response OK:', response.ok);
                console.log(
                    'Content Type:',
                    response.headers.get('content-type'),
                );

                const rawResponse = await response.text();

                console.log('Raw Response:', rawResponse);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${rawResponse}`);
                }

                let result: RelatedResponse;

                try {
                    result = JSON.parse(rawResponse);
                } catch {
                    throw new Error(
                        'Respons Laravel bukan JSON yang valid. Periksa endpoint /related-products.',
                    );
                }

                console.log('Parsed Response:', result);
                console.log('Identical:', result.identical);
                console.log('Recommended:', result.recommended);

                const identical = result.identical?.data ?? [];
                const recommended = result.recommended?.data ?? [];

                console.log('Identical Count:', identical.length);
                console.log('Recommended Count:', recommended.length);

                console.table(
                    identical.map((item) => ({
                        id: item.id,
                        name: item.name,
                        similarity: item.similarity,
                    })),
                );

                console.table(
                    recommended.map((item) => ({
                        id: item.id,
                        name: item.name,
                        similarity: item.similarity,
                    })),
                );

                console.groupEnd();

                setIdenticalProducts(identical);
                setRecommendedProducts(recommended);

                setIdenticalTotal(result.identical?.total ?? identical.length);

                setRecommendedTotal(
                    result.recommended?.total ?? recommended.length,
                );

                if (!result.identical || !result.recommended) {
                    console.warn(
                        'Struktur respons tidak sesuai: membutuhkan identical.data dan recommended.data.',
                    );
                }
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }

                console.error('========== RELATED API ERROR ==========');
                console.error(error);

                setRelatedError(
                    error instanceof Error
                        ? error.message
                        : 'Terjadi kesalahan saat mengambil produk terkait.',
                );
            } finally {
                if (!controller.signal.aborted) {
                    setRelatedLoading(false);
                }
            }
        };

        fetchRelatedProducts();

        return () => controller.abort();
    }, [selectedProduct]);

    // Tutup modal dengan Escape dan kunci scroll halaman.
    useEffect(() => {
        if (!selectedProduct) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSelectedProduct(null);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedProduct]);

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

                <div className="flex items-center gap-2">
                    {/* Filter Related */}
                    <button
                        type="button"
                        onClick={handleRelatedFilter}
                        disabled={productsLoading}
                        title={
                            relatedFilter
                                ? 'Tampilkan semua produk'
                                : 'Tampilkan produk dengan related lebih dari satu'
                        }
                        aria-label="Filter produk related lebih dari satu"
                        aria-pressed={relatedFilter}
                        className={`flex h-7 items-center gap-1 rounded-sm border px-2 text-[9px] font-bold shadow-sm transition active:scale-95 disabled:cursor-wait disabled:opacity-50 ${
                            relatedFilter
                                ? 'border-[#b9dfc9] bg-[#edf8f1] text-[#579875]'
                                : 'border-[#dce4ec] bg-gradient-to-b from-white to-[#edf3f8] text-[#6487a5] hover:border-[#a9c8e0]'
                        }`}
                    >
                        <Filter className="size-3" />

                        <div className="flex items-center gap-1">
                            Produk Lainnya
                            {relatedFilter ? (
                                <Check className="size-4 text-green-600" />
                            ) : (
                                <X className="size-4 text-red-500" />
                            )}
                        </div>
                    </button>

                    {/* Sorting */}
                    <button
                        type="button"
                        onClick={handleSort}
                        disabled={productsLoading}
                        title={
                            sort === 'desc'
                                ? 'Urutkan dari terlama'
                                : 'Urutkan dari terbaru'
                        }
                        aria-label={
                            sort === 'desc' ? 'Ascending' : 'Descending'
                        }
                        className="flex size-7 items-center justify-center rounded-sm border border-[#dce4ec] bg-gradient-to-b from-white to-[#edf3f8] text-[#6487a5] shadow-sm transition hover:border-[#a9c8e0] hover:bg-[#edf5fb] hover:text-[#3e79a8] active:scale-95 disabled:cursor-wait disabled:opacity-50"
                    >
                        {sort === 'desc' ? (
                            <ArrowDownWideNarrow className="size-4" />
                        ) : (
                            <ArrowUpWideNarrow className="size-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Product List */}
            <div className="relative min-h-[500px] px-2 py-2">
                {/* Daftar Produk */}
                <div
                    className={`transition-opacity duration-200 ${
                        productsLoading
                            ? 'pointer-events-none opacity-30'
                            : 'opacity-100'
                    }`}
                >
                    <InfiniteScroll
                        data="products"
                        onlyNext
                        buffer={300}
                        className="grid min-h-[500px] auto-rows-max grid-cols-2 content-start items-start gap-2"
                    >
                        {products.data.map((item) => (
                            <div
                                key={item.id}
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

                                    {/* Related Button */}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProduct(item)}
                                        className="absolute right-1.5 bottom-1.5 flex items-center gap-1 rounded-sm border border-white/70 bg-white/95 px-2 py-1 text-[9px] font-bold text-[#5286b1] shadow-sm backdrop-blur transition hover:bg-[#5286b1] hover:text-white active:scale-95"
                                    >
                                        <Layers3 className="size-3" />
                                        TERKAIT
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="flex min-h-[90px] w-full flex-col bg-gradient-to-b from-white to-[#fbfcfd] p-1.5">
                                    <ProductPrice item={item} />

                                    <h4 className="line-clamp-2 min-h-8 text-[11px] leading-4 text-[#566779] transition group-hover:text-[#4b83ad]">
                                        {item.name}
                                    </h4>

                                    <div className="mt-auto border-t border-dashed border-[#e2e8ef] pt-1.5">
                                        <a
                                            href={
                                                item.affiliate_link || item.link
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-1 rounded-sm border border-[#e6b98d] bg-gradient-to-b from-[#fff5e9] to-[#f8dfc4] px-1.5 py-1 text-[9px] font-bold text-[#a86d39] transition hover:to-[#f4d1ad]"
                                        >
                                            <ShoppingBag className="size-3" />
                                            LIHAT PRODUK
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>

                {/* Empty State */}
                {products.data.length === 0 && !productsLoading && (
                    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-sm border border-dashed border-[#d5e0e9] bg-white">
                        <ShoppingBag className="mb-2 size-7 text-[#91afc8]" />

                        <p className="text-xs text-[#91a1b1]">
                            {relatedFilter
                                ? 'Belum ada produk dengan related lebih dari satu.'
                                : 'Belum ada barang ditemukan.'}
                        </p>

                        {relatedFilter && (
                            <button
                                type="button"
                                onClick={handleRelatedFilter}
                                className="mt-3 rounded-sm border border-[#dce4ec] bg-white px-3 py-1.5 text-[10px] font-bold text-[#6487a5] hover:bg-[#f0f4f8]"
                            >
                                HAPUS FILTER
                            </button>
                        )}
                    </div>
                )}

                {/* Full Loading Overlay */}
                {productsLoading && (
                    <div className="absolute inset-2 z-30 flex min-h-[500px] flex-col items-center justify-center rounded-sm border border-[#e4dfd3] bg-[#faf7ef]/90 backdrop-blur-[2px]">
                        <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-[#e8dfcd] bg-white shadow-sm">
                            <div className="size-6 animate-spin rounded-full border-[3px] border-[#e8e0d1] border-t-[#b58b5a]" />
                        </div>

                        <p className="text-xs font-bold tracking-wide text-[#806d51]">
                            MEMUAT PRODUK
                        </p>

                        <p className="mt-1 text-[10px] text-[#a99a80]">
                            Sedang memperbarui daftar produk...
                        </p>
                    </div>
                )}
            </div>

            {/* Floating Total Produk */}
            <div className="pointer-events-none fixed inset-x-0 bottom-[56px] z-40">
                <div className="pointer-events-auto mx-auto flex h-10 w-full max-w-[400px] items-center justify-between border-t border-[#eadfca] bg-[#faf5e9]/95 px-4 shadow-[0_-2px_8px_rgba(120,100,60,0.06)] backdrop-blur-md">
                    <div className="flex items-center gap-2 text-[#9a8565]">
                        <ShoppingBag className="size-3.5" />

                        <span className="text-[10px] font-semibold tracking-wide">
                            {relatedFilter ? 'PRODUK RELATED' : 'TOTAL PRODUK'}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#766044]">
                            {products.total.toLocaleString('id-ID')}
                        </span>

                        <span className="text-[10px] text-[#a99a80]">
                            produk
                        </span>
                    </div>
                </div>
            </div>

            {/* Related Products Modal */}
            {selectedProduct && (
                <div
                    onClick={() => setSelectedProduct(null)}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#263747]/60 p-3 backdrop-blur-sm sm:p-6"
                >
                    <div
                        onClick={(event) => event.stopPropagation()}
                        className="flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-md border border-[#dce4ec] bg-[#f7f9fb] shadow-2xl"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-[#dce4ec] bg-white px-4 py-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-[#dce4ec] bg-gradient-to-b from-white to-[#edf3f8] text-[#5286b1]">
                                    <Layers3 className="size-4" />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-[#40566b]">
                                        Produk Terkait
                                    </h3>

                                    <p className="truncate text-[10px] text-[#91a1b1]">
                                        {selectedProduct.name}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedProduct(null)}
                                aria-label="Tutup modal"
                                className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-[#dce4ec] bg-white text-[#8295a7] transition hover:border-[#e5a5a0] hover:bg-[#fff2f0] hover:text-[#d46f69]"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Selected Product */}
                        <div className="flex items-center gap-3 border-b border-[#e2e8ef] bg-white px-4 py-3">
                            <div className="size-14 shrink-0 overflow-hidden rounded-sm border border-[#e2e8ef] bg-[#f0f3f6]">
                                {selectedProduct.link ? (
                                    <img
                                        src={selectedProduct.link}
                                        alt={selectedProduct.name}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center">
                                        <ShoppingBag className="size-5 text-[#b7c8d8]" />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <span className="mb-1 block text-[9px] font-bold tracking-wide text-[#91a1b1] uppercase">
                                    Produk yang dipilih
                                </span>

                                <h4 className="line-clamp-2 text-xs font-bold text-[#566779]">
                                    {selectedProduct.name}
                                </h4>

                                <div className="mt-1">
                                    <ProductPrice item={selectedProduct} />
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="min-h-0 flex-1 overflow-y-auto p-3">
                            {relatedLoading ? (
                                <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                                    <div className="mb-3 size-7 animate-spin rounded-full border-2 border-[#dce4ec] border-t-[#5286b1]" />

                                    <p className="text-xs text-[#91a1b1]">
                                        Menganalisis nama dan spesifikasi
                                        produk...
                                    </p>
                                </div>
                            ) : relatedError ? (
                                <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                                    <ShoppingBag className="mb-2 size-8 text-[#d46f69]" />

                                    <p className="text-xs font-bold text-[#566779]">
                                        Gagal mengambil produk terkait
                                    </p>

                                    <p className="mt-1 max-w-xs text-[10px] text-[#91a1b1]">
                                        {relatedError}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <ProductGroup
                                        title="PRODUK IDENTIK"
                                        description="Model dan spesifikasi yang cocok"
                                        products={identicalProducts}
                                        total={identicalTotal}
                                        loading={relatedLoading}
                                        icon={
                                            <CheckCircle2 className="size-4" />
                                        }
                                        type="identical"
                                    />

                                    <ProductGroup
                                        title="REKOMENDASI PRODUK"
                                        description="Produk sejenis dengan model atau spesifikasi berbeda"
                                        products={recommendedProducts}
                                        total={recommendedTotal}
                                        loading={relatedLoading}
                                        icon={<Sparkles className="size-4" />}
                                        type="recommended"
                                    />
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between border-t border-[#dce4ec] bg-white px-4 py-2">
                            <span className="text-[9px] text-[#91a1b1]">
                                Pencocokan berdasarkan nama produk
                            </span>

                            <button
                                type="button"
                                onClick={() => setSelectedProduct(null)}
                                className="rounded-sm border border-[#dce4ec] bg-gradient-to-b from-white to-[#edf3f8] px-3 py-1.5 text-[10px] font-bold text-[#6487a5] transition hover:border-[#a9c8e0]"
                            >
                                TUTUP
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
