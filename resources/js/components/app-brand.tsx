import { ShoppingBag } from 'lucide-react';

export default function Brands() {
    return (
        <div className="p-2">
            <div className="h-20 max-w-200 border border-gray-300 bg-slate-200 p-2">
                <div className="text-md flex flex-row gap-2 font-bold">
                    <ShoppingBag />
                    MyCatalog Whislist
                </div>
                <p className="text-sm">
                    Selamat mencari barang yang anda butuhkan
                </p>
            </div>
        </div>
    );
}
