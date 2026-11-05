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
        <div className="m-2 flex h-64 max-w-100 flex-col overflow-hidden rounded-sm border border-[#d4e0eb] bg-[#f3f6fa] shadow-[0_2px_6px_rgba(50,80,110,0.08)]">
            <div className="flex items-center justify-between border-b border-[#c9dbea] bg-gradient-to-b from-[#fafdff] to-[#e5eff8] px-3 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-sm border border-[#d1e2f0] bg-gradient-to-b from-white to-[#e6f1fa]">
                        <Tags className="size-5 text-[#5286b1]" />
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-[#40566b]">
                            Topik Populer
                        </h3>
                        <p className="text-[11px] text-[#91a1b1]">
                            Pilih satu atau beberapa topik
                        </p>
                    </div>
                </div>

                <span className="rounded-sm border border-[#c9dbea] bg-white px-2 py-1 text-[10px] font-bold text-[#6487a5] shadow-sm">
                    {topics.length} TOPIK
                </span>
            </div>

            <div className="thin-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto bg-[#fbfcfd] p-2">
                {topics.map((topic) => {
                    const active = selectedTopics.includes(topic.name);

                    return (
                        <button
                            key={topic.name}
                            type="button"
                            onClick={() => onSelect(topic.name)}
                            className={`group flex w-full items-center justify-between rounded-sm border px-2.5 py-2 text-left transition ${
                                active
                                    ? 'border-[#e6c99f] bg-gradient-to-b from-[#fff9ef] to-[#f8ead5] shadow-[inset_0_1px_2px_rgba(180,130,70,0.08)]'
                                    : 'border-transparent hover:border-[#dce5ed] hover:bg-gradient-to-b hover:from-white hover:to-[#f0f5f9]'
                            }`}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <Hash
                                    className={`size-3.5 shrink-0 ${
                                        active
                                            ? 'text-[#c58b4d]'
                                            : 'text-[#9aafc1] group-hover:text-[#6487a5]'
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
                                        : 'border-[#dce4ec] bg-gradient-to-b from-white to-[#f0f4f8] text-[#91a1b1]'
                                }`}
                            >
                                {topic.count}
                            </span>
                        </button>
                    );
                })}

                {topics.length === 0 && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6">
                        <div className="flex size-12 items-center justify-center rounded-sm border border-[#dce7f0] bg-gradient-to-b from-white to-[#edf3f8]">
                            <Tags className="size-6 text-[#91afc8]" />
                        </div>

                        <p className="text-xs text-[#91a1b1]">
                            Belum ada topik ditemukan.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-[#dce4ec] bg-gradient-to-b from-white to-[#f0f4f8] px-3 py-2">
                <span className="text-[10px] text-[#91a1b1]">
                    {selectedTopics.length} topik dipilih
                </span>

                <button
                    type="button"
                    onClick={onClear}
                    disabled={!hasFilter}
                    className="flex items-center gap-1 rounded-sm border border-[#e4d3d1] bg-gradient-to-b from-white to-[#f8eeee] px-2 py-1 text-[10px] font-bold text-[#c47770] transition hover:border-[#dba9a4] hover:to-[#f5e2e0] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <RotateCcw className="size-3" />
                    HAPUS FILTER
                    {hasFilter && <X className="size-3" />}
                </button>
            </div>
        </div>
    );
}
