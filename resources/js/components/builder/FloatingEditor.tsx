import React, { useMemo, useRef, useState } from 'react';
import { X, Move } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { BlockNoteView } from '@blocknote/shadcn';
import { useCreateBlockNote } from '@blocknote/react';

interface FloatingEditorProps {
    isOpen: boolean;
    type: 'tinymce' | 'blocknote';
    value: string;
    title: string;
    onChange: (value: string) => void;
    onClose: () => void;
}

interface BlockNoteEditorProps {
    value: string;
    onChange: (value: string) => void;
}

function BlockNoteEditor({ value, onChange }: BlockNoteEditorProps) {
    const initialContent = useMemo(() => {
        if (!value) {
            return undefined;
        }

        try {
            const parsed = JSON.parse(value);

            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch {
            return undefined;
        }

        return undefined;
    }, []); // Memastikan initialContent hanya dihitung sekali saat mount

    const editor = useCreateBlockNote({
        initialContent,
    });

    return (
        <div className="blocknote-wrapper w-full">
            <div className="blocknote-container w-full">
                <BlockNoteView
                    editor={editor}
                    onChange={() => {
                        onChange(JSON.stringify(editor.document));
                    }}
                />
            </div>
        </div>
    );
}

export default function FloatingEditor({
    isOpen,
    type,
    value,
    title,
    onChange,
    onClose,
}: FloatingEditorProps) {
    const [position, setPosition] = useState({
        x: 360,
        y: 120,
    });

    const dragging = useRef(false);

    const dragOffset = useRef({
        x: 0,
        y: 0,
    });

    if (!isOpen) {
        return null;
    }

    const handleMouseDown = (event: React.MouseEvent) => {
        dragging.current = true;

        dragOffset.current = {
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!dragging.current) {
                return;
            }

            setPosition({
                x: moveEvent.clientX - dragOffset.current.x,
                y: moveEvent.clientY - dragOffset.current.y,
            });
        };

        const handleMouseUp = () => {
            dragging.current = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className="fixed z-[100] flex w-[700px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl"
            style={{
                left: position.x,
                top: position.y,
            }}
        >
            {/* HEADER */}
            <div
                onMouseDown={handleMouseDown}
                className="flex h-11 shrink-0 cursor-move items-center justify-between border-b border-slate-700 bg-slate-950 px-3"
            >
                <div className="flex items-center gap-2">
                    <Move className="h-4 w-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-200">
                        {title}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* EDITOR */}
            <div className="max-h-[70vh] overflow-auto bg-white p-3">
                {/* Type 1: TinyMCE */}
                {type === 'tinymce' && (
                    <div className="w-full min-w-0 overflow-hidden">
                        <Editor
                            value={value}
                            tinymceScriptSrc="/tinymce/tinymce.min.js"
                            licenseKey="gpl"
                            onEditorChange={(content) => {
                                onChange(content);
                            }}
                            init={{
                                height: 400,
                                width: '100%',
                                menubar: true,
                                branding: false,
                                promotion: false,
                                skin: 'oxide-dark',
                                skin_url: '/tinymce/skins/ui/oxide-dark',
                                content_css: 'dark',
                                plugins: [
                                    'advlist',
                                    'autolink',
                                    'lists',
                                    'link',
                                    'image',
                                    'charmap',
                                    'preview',
                                    'anchor',
                                    'searchreplace',
                                    'visualblocks',
                                    'code',
                                    'fullscreen',
                                    'insertdatetime',
                                    'media',
                                    'table',
                                    'help',
                                    'wordcount',
                                ],
                                toolbar:
                                    'undo redo | blocks | ' +
                                    'bold italic underline | ' +
                                    'alignleft aligncenter alignright | ' +
                                    'bullist numlist | ' +
                                    'link image media | ' +
                                    'code fullscreen',
                            }}
                        />
                    </div>
                )}

                {/* Type 2: BlockNote */}
                {type === 'blocknote' && (
                    <BlockNoteEditor value={value} onChange={onChange} />
                )}
            </div>
        </div>
    );
}
