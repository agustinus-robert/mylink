import { Hash } from 'lucide-react';

type Topic = {
    id: number;
    name: string;
};

type Props = {
    topics: Topic[];
};

export default function Topics({ topics }: Props) {
    return (
        <div className="m-2 flex h-40 max-w-100 flex-col rounded-lg border border-gray-300 p-3">
            <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
                <Hash className="size-5 shrink-0 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Topik terbaru</h3>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pt-2">
                {topics.map((topic, index) => (
                    <div
                        key={topic.id}
                        className="flex items-center gap-2 text-sm text-gray-600"
                    >
                        <span className="w-4 shrink-0 text-gray-400">
                            {index + 1}.
                        </span>
                        <span className="truncate">{topic.name}</span>
                    </div>
                ))}

                {topics.length === 0 && (
                    <p className="text-sm text-gray-400">
                        Tidak ada topik ditemukan.
                    </p>
                )}
            </div>
        </div>
    );
}
