import { Plus, Trash2, Package } from 'lucide-react';

export interface IncomingItem {
    id?: number;
    name: string;
    harga: number;
    qty: number;
    uom: string;
    total: number;
    expired: string | null;
}

interface Props {
    items: IncomingItem[];
    onChange: (items: IncomingItem[]) => void;
    errors: Record<string, string>;
}

const inputClass =
    'w-full min-w-24 rounded-md border border-slate-700 bg-background px-3 py-2 text-sm text-slate-100 outline-none focus:border-primary disabled:opacity-50';

export default function IncomingItemsForm({ items, onChange, errors }: Props) {
    function updateItem(
        index: number,
        field: 'name' | 'harga' | 'qty' | 'uom' | 'expired',
        value: string | number,
    ) {
        const updated = items.map((item, i) => {
            if (i !== index) {
                return item;
            }

            const next: IncomingItem = { ...item };

            switch (field) {
                case 'name':
                    next.name = String(value);
                    break;
                case 'harga':
                    next.harga = Number(value);
                    break;
                case 'qty':
                    next.qty = Number(value);
                    break;
                case 'uom':
                    next.uom = String(value);
                    break;
                case 'expired':
                    next.expired = value === '' ? null : String(value);
                    break;
            }

            next.total = next.harga * next.qty;

            return next;
        });

        onChange(updated);
    }

    function addItem() {
        onChange([
            ...items,
            {
                name: '',
                harga: 0,
                qty: 1,
                uom: '',
                total: 0,
                expired: null,
            },
        ]);
    }

    function removeItem(index: number) {
        onChange(items.filter((_, i) => i !== index));
    }

    function getError(field: keyof IncomingItem, index: number) {
        return errors[`items.${index}.${field}`];
    }

    function renderError(field: keyof IncomingItem, index: number) {
        const error = getError(field, index);

        if (!error) return null;

        return <p className="mt-1 text-xs text-red-400">{error}</p>;
    }

    const grandTotal = items.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0,
    );

    return (
        <section className="border-t border-slate-800">
            <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-slate-100">
                        <Package size={18} />
                        Detail Barang Masuk
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                        Kelola daftar barang yang diterima.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center justify-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    <Plus size={16} />
                    Tambah Item
                </button>
            </div>

            <div className="overflow-x-auto px-6 pb-6">
                <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                            <th className="w-10 px-3 py-3">No.</th>
                            <th className="px-3 py-3">Nama Barang</th>
                            <th className="w-36 px-3 py-3">Harga</th>
                            <th className="w-24 px-3 py-3">Qty</th>
                            <th className="w-28 px-3 py-3">Satuan</th>
                            <th className="w-36 px-3 py-3">Total</th>
                            <th className="w-40 px-3 py-3">Kedaluwarsa</th>
                            <th className="w-16 px-3 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item, index) => (
                            <tr
                                key={item.id ?? `new-${index}`}
                                className="border-b border-slate-800 align-top"
                            >
                                <td className="px-3 py-4 text-slate-400">
                                    {index + 1}
                                </td>

                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama barang"
                                        className={inputClass}
                                    />
                                    {renderError('name', index)}
                                </td>

                                <td className="p-2">
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={item.harga}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'harga',
                                                e.target.value === ''
                                                    ? 0
                                                    : Number(e.target.value),
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {renderError('harga', index)}
                                </td>

                                <td className="p-2">
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={item.qty}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'qty',
                                                e.target.value === ''
                                                    ? 0
                                                    : Number(e.target.value),
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {renderError('qty', index)}
                                </td>

                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={item.uom}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'uom',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Pcs"
                                        className={inputClass}
                                    />
                                    {renderError('uom', index)}
                                </td>

                                <td className="p-2">
                                    <input
                                        type="number"
                                        value={item.total}
                                        readOnly
                                        className={`${inputClass} bg-slate-900/50`}
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        type="date"
                                        value={item.expired ?? ''}
                                        onChange={(e) =>
                                            updateItem(
                                                index,
                                                'expired',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {renderError('expired', index)}
                                </td>

                                <td className="p-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        title="Hapus item"
                                        aria-label={`Hapus item ${index + 1}`}
                                        className="rounded-md p-2 text-red-400 hover:bg-red-400/10"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {items.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-3 py-12 text-center text-slate-500"
                                >
                                    Belum ada detail barang. Klik Tambah Item
                                    untuk memulai.
                                </td>
                            </tr>
                        )}
                    </tbody>

                    {items.length > 0 && (
                        <tfoot>
                            <tr className="bg-slate-900/40">
                                <td
                                    colSpan={5}
                                    className="px-3 py-4 text-right font-semibold text-slate-300"
                                >
                                    Grand Total
                                </td>
                                <td className="px-3 py-4 font-semibold text-slate-100">
                                    {new Intl.NumberFormat('id-ID', {
                                        maximumFractionDigits: 0,
                                    }).format(grandTotal)}
                                </td>
                                <td colSpan={2} />
                            </tr>
                        </tfoot>
                    )}
                </table>

                {errors.items && (
                    <p className="mt-3 text-sm text-red-400">{errors.items}</p>
                )}
            </div>
        </section>
    );
}
