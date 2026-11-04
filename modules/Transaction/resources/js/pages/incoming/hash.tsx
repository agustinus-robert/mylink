import { useState } from 'react';
import type { FormDataConvertible } from '@inertiajs/core';

interface Props {
    data: {
        topic: string;
    };
    setData: (key: string, value: FormDataConvertible) => void;
    errors: Record<string, string>;
}

const inputClass =
    'w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground';

export default function IncomingFormHash({ data, setData, errors }: Props) {
    const [input, setInput] = useState('');

    const topics = data.topic
        ? data.topic
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
        : [];

    const addTopic = (value: string) => {
        const topic = value.trim().replace(/^#+/, '');

        if (!topic || topics.includes(topic)) {
            setInput('');
            return;
        }

        setData('topic', [...topics, topic].join(', '));
        setInput('');
    };

    const removeTopic = (topic: string) => {
        setData('topic', topics.filter((item) => item !== topic).join(', '));
    };

    return (
        <section className="border-b border-border p-6">
            <h3 className="mb-4 text-base font-semibold text-foreground">
                Informasi Topik
            </h3>

            <div>
                <label
                    htmlFor="topic"
                    className="mb-1 block text-sm font-medium text-foreground"
                >
                    Hashtag
                </label>

                <div
                    className={`flex min-h-11 flex-wrap items-center gap-2 rounded-md border bg-background px-3 py-2 ${
                        errors.topic
                            ? 'border-destructive'
                            : 'border-input focus-within:border-primary'
                    }`}
                >
                    {topics.map((topic) => (
                        <span
                            key={topic}
                            className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-1 text-xs text-primary"
                        >
                            #{topic}
                            <button
                                type="button"
                                onClick={() => removeTopic(topic)}
                                className="ml-1 text-primary/70 transition-colors hover:text-destructive"
                            >
                                ×
                            </button>
                        </span>
                    ))}

                    <input
                        type="text"
                        id="topic"
                        value={input}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (value.includes(',')) {
                                const parts = value.split(',');
                                parts.slice(0, -1).forEach(addTopic);
                                setInput(parts[parts.length - 1]);
                            } else {
                                setInput(value);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                addTopic(input);
                            }

                            if (
                                e.key === 'Backspace' &&
                                !input &&
                                topics.length
                            ) {
                                removeTopic(topics[topics.length - 1]);
                            }
                        }}
                        placeholder={
                            topics.length
                                ? ''
                                : 'Ketik hashtag, pisahkan dengan koma'
                        }
                        className={inputClass}
                    />
                </div>

                {errors.topic && (
                    <p className="mt-1 text-sm text-destructive">
                        {errors.topic}
                    </p>
                )}
            </div>
        </section>
    );
}
