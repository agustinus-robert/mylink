import { Hash, Tags, X, RotateCcw } from 'lucide-react';

type Topic = {
    name: string;
    count: number;
};

type Props = {
    topics: Topic[];
    selectedTopics: string[];
    onSelect: (name: string) => void;
    onClear: () => void;
};

export default function Topics({
    topics,
    selectedTopics,
    onSelect,
    onClear,
}: Props) {
    const hasFilter = selectedTopics.length > 0;

    return (
        <div className="flex h-64 w-full flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#dce4ec] px-3 py-2">
                <span className="text-[10px] font-semibold text-[#8296a9]">
                    Jumlah {topics.length} TOPIK
                </span>
            </div>

            {/* Topic List */}
            <div className="thin-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
                {topics.map((topic) => {
                    const active = selectedTopics.includes(topic.name);

                    return (
                        <button
                            key={topic.name}
                            type="button"
                            onClick={() => onSelect(topic.name)}
                            className={`group flex w-full items-center justify-between rounded-sm border px-2.5 py-2 text-left transition ${
                                active
                                    ? 'border-[#e6c99f] bg-[#fff3df]'
                                    : 'border-transparent hover:border-[#dce5ed] hover:bg-[#f5f8fb]'
                            }`}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <Hash
                                    className={`size-3.5 shrink-0 ${
                                        active
                                            ? 'text-[#c58b4d]'
                                            : 'text-[#9aafc1]'
                                    }`}
                                />

                                <span
                                    className={`truncate text-sm ${
                                        active
                                            ? 'font-bold text-[#986b37]'
                                            : 'font-medium text-[#566779]'
                                    }`}
                                >
                                    {topic.name}
                                </span>
                            </div>

                            <span
                                className={`ml-2 shrink-0 rounded-sm border px-2 py-0.5 text-[10px] font-semibold ${
                                    active
                                        ? 'border-[#e6c99f] bg-white text-[#a77a45]'
                                        : 'border-[#dce4ec] bg-white text-[#91a1b1]'
                                }`}
                            >
                                {topic.count}
                            </span>
                        </button>
                    );
                })}

                {topics.length === 0 && (
                    <div className="flex flex-1 items-center justify-center py-6">
                        <p className="text-xs text-[#91a1b1]">
                            Belum ada topik ditemukan.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[#dce4ec] px-3 py-2">
                <span className="text-[10px] text-[#91a1b1]">
                    {selectedTopics.length} topik dipilih
                </span>

                <button
                    type="button"
                    onClick={onClear}
                    disabled={!hasFilter}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#c47770] transition hover:text-[#a95750] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <RotateCcw className="size-3" />
                    HAPUS FILTER
                    {hasFilter && <X className="size-3" />}
                </button>
            </div>
        </div>
    );
}
