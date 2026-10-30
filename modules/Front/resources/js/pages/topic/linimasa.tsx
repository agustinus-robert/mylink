import { useState } from 'react';
import { Voicemail, Link } from 'lucide-react';

export default function Linimasa() {
    const [expanded, setExpanded] = useState<number | null>(null);

    const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip`;

    const limit = 120;
    const arr = 3;

    const items = [];

    for (let i = 0; i < arr; i++) {
        items.push(
            <div
                key={i}
                className="mb-2 flex min-h-0 flex-row gap-3 overflow-y-auto"
            >
                <div className="flex w-full flex-1 flex-col gap-2 rounded border border-gray-300 p-2">
                    <h1 className="font-bold">Test {i + 1}</h1>

                    <p className="whitespace-pre-line text-gray-700">
                        {expanded === i
                            ? description
                            : `${description.slice(0, limit)}${description.length > limit ? '...' : ''}`}
                    </p>

                    {description.length > limit && (
                        <button
                            onClick={() =>
                                setExpanded(expanded === i ? null : i)
                            }
                            className="mt-1 w-fit text-sm font-semibold text-blue-600 hover:underline"
                        >
                            {expanded === i
                                ? 'Lihat lebih sedikit'
                                : 'Lihat selengkapnya'}
                        </button>
                    )}

                    <div className="flex flex-row items-center gap-1">
                        <div className="text-sm italic">
                            posted: 20 Oktober 2026
                        </div>

                        <div className="ml-auto flex items-center gap-1">
                            <Link className="size-4" />
                            <div className="text-sm">Gambar</div>
                        </div>
                    </div>
                </div>
            </div>,
        );
    }

    return (
        <div className="m-2 flex max-w-100 flex-col rounded-lg border border-gray-300 p-3">
            <div className="flex items-center gap-1 border-gray-200 pb-2">
                <Voicemail className="size-5 shrink-0 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Linimasa</h3>
            </div>

            {items}
        </div>
    );
}
