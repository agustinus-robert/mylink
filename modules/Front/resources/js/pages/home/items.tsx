import { Hand } from 'lucide-react';

const items = [
    { id: 1, name: 'Laptop', price: 'Rp 5.000.000', image: '' },
    { id: 2, name: 'Keyboard', price: 'Rp 250.000', image: '' },
    { id: 3, name: 'Mouse', price: 'Rp 150.000', image: '' },
    { id: 4, name: 'Monitor', price: 'Rp 1.500.000', image: '' },
];

export default function Items() {
    return (
        <div className="m-2 flex h-[600px] max-w-100 flex-col border border-gray-300 p-2">
            <div className="mb-3 flex shrink-0 items-center gap-1 border-b border-gray-200 pb-2">
                <Hand className="size-5 shrink-0 text-gray-600" />
                <h3 className="font-semibold">Barang terbaru</h3>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-3 overflow-y-auto">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="min-w-0 overflow-hidden rounded-lg border border-gray-200 transition hover:border-gray-400"
                    >
                        <div className="h-40 w-full bg-gray-100">
                            <img
                                src={item.image || undefined}
                                alt={item.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="space-y-1 p-2">
                            <p className="text-base font-bold text-gray-900">
                                {item.price}
                            </p>

                            <h4 className="truncate text-sm text-gray-700">
                                {item.name}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
