import { Link, Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import type { DataTableProps } from './types';

export default function datatable<Type>({
    heading,
    data,
    columns,
    link,
}: DataTableProps<Type>) {
    return (
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-background shadow-xl">
                {heading?.head && (
                    <div className="flex items-center justify-between border-b border-slate-800 bg-background px-6 py-4">
                        <h2 className="text-lg font-semibold text-slate-100">
                            {heading.head}
                        </h2>

                        <Link
                            href={route(link.add)}
                            className="btn rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white"
                        >
                            Tambah
                        </Link>
                    </div>
                )}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="border-b border-slate-800 bg-background text-xs tracking-wider text-slate-400 uppercase">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={String(column.key)}
                                        className="px-6 py-3.5 font-medium"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800 bg-background">
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="transition-colors hover:bg-slate-800/50"
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={String(column.key)}
                                                className="px-6 py-4 whitespace-nowrap text-slate-300"
                                            >
                                                {column.render
                                                    ? column.render(row)
                                                    : String(
                                                          (
                                                              row as Record<
                                                                  string,
                                                                  any
                                                              >
                                                          )[
                                                              column.key as string
                                                          ] ?? '',
                                                      )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-12 text-center text-sm font-medium text-slate-500"
                                    >
                                        Tidak ada data tersedia.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
