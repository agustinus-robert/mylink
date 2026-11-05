import { Hand } from 'lucide-react';

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
        <div className="m-2 flex h-[600px] max-w-100 flex-col border border-gray-300 p-2">
            <div className="mb-3 flex shrink-0 items-center gap-1 border-b border-gray-200 pb-2">
                <Hand className="size-5 shrink-0 text-gray-600" />
                <h3 className="font-semibold">Barang terbaru</h3>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-3 overflow-y-auto">
                {products.map((item) => (
                    <a
                        href={item.affiliate_link}
                        key={item.id}
                        className="min-w-0 overflow-hidden rounded-lg border border-gray-200 transition hover:border-gray-400"
                    >
                        <div className="h-40 w-full bg-gray-100">
                            <img
                                src={item.link || undefined}
                                alt={item.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="space-y-1 p-2">
                            <p className="text-base font-bold text-gray-900">
                                {item.detail?.prices}
                            </p>

                            <h4 className="truncate text-sm text-gray-700">
                                {item.name}
                            </h4>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
