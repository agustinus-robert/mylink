import { Head } from '@inertiajs/react';

interface IncomingItem {
    id: number;
    name: string;
    harga: number | string;
    qty: number;
    uom: string;
    total: number | string;
    expired: string | null;
}

interface Incoming {
    id: number;
    incoming_from: string;
    referenced: string | null;
    grand_total: number | string;
    created_at: string;
    category?: { name: string } | null;
    subCategory?: { name: string } | null;
    sub_category?: { name: string } | null;
    creator?: { name: string } | null;
    items?: IncomingItem[];
}

interface Props {
    incoming: Incoming;
}

export default function IncomingReceipt({ incoming }: Props) {
    const currency = (value: number | string) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(value));

    const date = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(incoming.created_at));

    return (
        <>
            <Head title={`Nota Pemasukan #${incoming.id}`} />

            <div className="min-h-screen bg-background px-4 py-8 text-foreground print:min-h-0 print:bg-white print:p-0 print:text-black">
                <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-xl print:max-w-none print:rounded-none print:border-0 print:bg-white print:shadow-none">
                    <div className="border-b border-slate-800 px-6 py-5 print:border-b-2 print:border-black print:px-0">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-xl font-bold tracking-wide text-slate-100 print:text-black">
                                    NOTA BARANG MASUK
                                </h1>
                                <p className="mt-1 text-sm text-slate-400 print:text-slate-600">
                                    Bukti transaksi pemasukan barang
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs text-slate-500 print:text-slate-600">
                                    NO. INVOICE
                                </p>
                                <p className="mt-1 font-semibold text-indigo-400 print:text-black">
                                    #{String(incoming.id).padStart(5, '0')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 px-6 py-5 print:px-0">
                        <div className="grid grid-cols-[120px_1fr] gap-3 text-sm">
                            <span className="text-slate-500">Tanggal</span>
                            <span className="font-medium text-slate-200 print:text-black">
                                {date}
                            </span>

                            <span className="text-slate-500">Asal Barang</span>
                            <span className="font-medium text-slate-200 print:text-black">
                                {incoming.incoming_from}
                            </span>

                            <span className="text-slate-500">Referensi</span>
                            <span className="text-slate-300 print:text-black">
                                {incoming.referenced || '-'}
                            </span>

                            <span className="text-slate-500">Kategori</span>
                            <span className="text-slate-300 print:text-black">
                                {incoming.category?.name ?? '-'}
                            </span>

                            <span className="text-slate-500">Subkategori</span>
                            <span className="text-slate-300 print:text-black">
                                {incoming.sub_category?.name ??
                                    incoming.subCategory?.name ??
                                    '-'}
                            </span>

                            <span className="text-slate-500">Dibuat oleh</span>
                            <span className="text-slate-300 print:text-black">
                                {incoming.creator?.name ?? '-'}
                            </span>
                        </div>
                    </div>

                    <div className="px-6 pb-5 print:px-0">
                        <div className="mb-3 border-t border-dashed border-slate-700 print:border-slate-400" />

                        <h2 className="mb-3 text-sm font-semibold text-slate-100 print:text-black">
                            Rincian Barang
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-y border-slate-800 bg-slate-900 text-xs tracking-wide text-slate-400 uppercase print:border-slate-400 print:bg-white print:text-black">
                                        <th className="px-3 py-3 font-medium print:px-2">
                                            Barang
                                        </th>
                                        <th className="px-3 py-3 text-right font-medium print:px-2">
                                            Qty
                                        </th>
                                        <th className="px-3 py-3 text-right font-medium print:px-2">
                                            Harga
                                        </th>
                                        <th className="px-3 py-3 text-right font-medium print:px-2">
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                                    {incoming.items?.length ? (
                                        incoming.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-3 py-3 text-slate-200 print:px-2 print:text-black">
                                                    <div className="font-medium">
                                                        {item.name}
                                                    </div>

                                                    {item.expired && (
                                                        <div className="mt-1 text-xs text-slate-500 print:text-slate-600">
                                                            Kedaluwarsa:{' '}
                                                            {item.expired}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-3 py-3 text-right whitespace-nowrap text-slate-300 print:px-2 print:text-black">
                                                    {item.qty} {item.uom}
                                                </td>

                                                <td className="px-3 py-3 text-right whitespace-nowrap text-slate-300 print:px-2 print:text-black">
                                                    {currency(item.harga)}
                                                </td>

                                                <td className="px-3 py-3 text-right font-medium whitespace-nowrap text-slate-200 print:px-2 print:text-black">
                                                    {currency(item.total)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-3 py-8 text-center text-slate-500 print:text-slate-600"
                                            >
                                                Tidak ada detail barang.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900/70 px-4 py-4 print:rounded-none print:border-t print:border-r-0 print:border-b-0 print:border-l-0 print:border-slate-400 print:bg-white print:px-2">
                            <span className="text-sm font-semibold text-slate-300 print:text-black">
                                TOTAL PEMASUKAN
                            </span>
                            <span className="text-lg font-bold text-indigo-400 print:text-black">
                                {currency(incoming.grand_total)}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 px-6 py-5 text-center print:border-slate-400 print:px-0">
                        <p className="text-xs text-slate-500 print:text-slate-600">
                            Dokumen ini merupakan bukti transaksi barang masuk.
                        </p>
                    </div>

                    <div className="flex justify-center gap-3 px-6 pb-6 print:hidden">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                        >
                            Cetak Nota
                        </button>

                        <button
                            type="button"
                            onClick={() => window.close()}
                            className="rounded-md border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 15mm;
                    }

                    body {
                        background: #ffffff !important;
                        color: #000000 !important;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </>
    );
}
