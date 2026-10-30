import { Hash } from 'lucide-react';

const topics = [
    '#laptop_murah',
    '#keyboard_terbaru',
    '#mouse_terbaik',
    '#aksesorisHp',
];

export default function Topics() {
    return (
        <div className="m-2 flex h-40 max-w-100 flex-col rounded-lg border border-gray-300 p-3">
            <div className="flex items-center gap-1 border-b border-gray-200 pb-2">
                <Hash className="size-5 shrink-0 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Topik terbaru</h3>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pt-2">
                {topics.map((topic, index) => (
                    <div
                        key={topic}
                        className="flex items-center gap-2 text-sm text-gray-600"
                    >
                        <span className="w-4 shrink-0 text-gray-400">
                            {index + 1}.
                        </span>
                        <span className="truncate">{topic}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
