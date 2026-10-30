
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface AppModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    maxWidth?: string;
}

export default function AppModal({
    open,
    onClose,
    title,
    children,
    maxWidth = 'max-w-lg',
}: AppModalProps) {
    useEffect(() => {
        if (!open) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                onClose();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title ?? 'Dialog'}
                className={`w-full ${maxWidth} overflow-hidden rounded-xl border border-slate-700 bg-background shadow-2xl`}
            >
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-100">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup modal"
                        className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}