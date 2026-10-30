import { useState } from 'react';
import {
    HandHelping,
    User,
    CalendarDays,
    MessageCircle,
    Send,
    StickyNote,
} from 'lucide-react';

export default function Linimasa() {
    const [expanded, setExpanded] = useState<number | null>(null);
    const [activeComment, setActiveComment] = useState<number | null>(null);

    const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua. Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip`;

    const limit = 120;
    const arr = 3;
    const items = [];

    for (let i = 0; i < arr; i++) {
        const comments = i + 2;

        items.push(
            <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-3 transition hover:border-sky-200"
            >
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-full bg-sky-50">
                            <User className="size-5 text-sky-600" />
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-800">
                                Anonim
                            </h4>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <CalendarDays className="size-3" />
                                20 Oktober 2026
                            </div>
                        </div>
                    </div>

                    <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-medium text-sky-600">
                        Request #{i + 1}
                    </span>
                </div>

                <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
                    {expanded === i
                        ? description
                        : `${description.slice(0, limit)}${description.length > limit ? '...' : ''}`}
                </p>

                {description.length > limit && (
                    <button
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        className="mt-2 text-xs font-semibold text-sky-600 hover:text-sky-700"
                    >
                        {expanded === i
                            ? 'Lihat lebih sedikit'
                            : 'Lihat selengkapnya'}
                    </button>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-400">Catatan</span>

                    <button
                        onClick={() =>
                            setActiveComment(activeComment === i ? null : i)
                        }
                        className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                            activeComment === i
                                ? 'bg-sky-50 text-sky-600'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-sky-600'
                        }`}
                    >
                        <MessageCircle className="size-4" />
                        {comments} Komentar
                    </button>
                </div>

                {activeComment === i && (
                    <div className="mt-2 border-t border-gray-100 pt-3">
                        <div className="mb-3 space-y-3">
                            {Array.from({ length: comments }).map(
                                (_, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                            <User className="size-4 text-gray-500" />
                                        </div>

                                        <div className="flex-1 rounded-lg bg-gray-50 p-2">
                                            <p className="text-xs font-semibold text-gray-700">
                                                Pengguna {index + 1}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-600">
                                                Saya tertarik dengan permintaan
                                                ini.
                                            </p>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Tulis komentar..."
                                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-sky-400"
                            />

                            <button className="rounded-lg bg-sky-500 p-2 text-white transition hover:bg-sky-600">
                                <Send className="size-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>,
        );
    }

    return (
        <div className="m-2 flex w-full max-w-100 flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-sky-50">
                    <StickyNote className="size-5 text-sky-600" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                        Catatan
                    </h3>
                    <p className="text-xs text-gray-400">
                        Daftar catatan admin
                    </p>
                </div>
            </div>

            {items}
        </div>
    );
}
