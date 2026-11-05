import { Hash, Tags } from 'lucide-react';

type Topic = {
    name: string;
    count: number;
};

type Props = {
    topics: Topic[];
};

export default function Topics({ topics }: Props) {
    return (
        <div className="m-2 flex h-64 max-w-100 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100">
                        <Tags className="size-4 text-gray-600" />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                            Topik populer
                        </h3>
                        <p className="text-xs text-gray-400">
                            Topik berdasarkan produk
                        </p>
                    </div>
                </div>

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {topics.length} topik
                </span>
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto pt-3">
                {topics.map((topic, index) => (
                    <div
                        key={topic.name}
                        className="group flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-gray-50"
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <Hash className="size-3.5 shrink-0 text-gray-400 transition-colors group-hover:text-gray-700" />

                            <span className="truncate text-sm font-medium text-gray-700">
                                {topic.name}
                            </span>
                        </div>

                        <span className="ml-2 shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
                            {topic.count} barang
                        </span>
                    </div>
                ))}

                {topics.length === 0 && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6">
                        <Tags className="size-7 text-gray-300" />
                        <p className="text-sm text-gray-400">
                            Belum ada topik ditemukan.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
