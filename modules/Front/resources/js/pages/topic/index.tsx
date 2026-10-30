import { useState } from 'react';
import { Hash } from 'lucide-react';
import Linimasa from './linimasa';

export default function topics() {
    return (
        <div className="p-2">
            <div className="min-h-180 max-w-200 border border-gray-300">
                <div className="m-2 flex max-w-100 flex-col rounded-lg border border-gray-300 p-3">
                    <div className="flex items-center gap-1 border-gray-200 pb-2">
                        <Hash className="size-5 shrink-0 text-gray-600" />
                        <h3 className="font-semibold text-gray-800">
                            Topik terbaru
                        </h3>
                    </div>
                </div>
                <Linimasa />
            </div>
        </div>
    );
}
