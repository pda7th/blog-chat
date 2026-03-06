'use client';

import { useState, useRef } from 'react';

type Props = {
  onSend: (content: string) => Promise<void>;
};

export default function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || sending) return;

    setSending(true);
    await onSend(trimmed);
    setValue('');
    setSending(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="메시지를 입력하세요"
        className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2 outline-none"
        disabled={sending}
      />
      <button
        type="submit"
        disabled={!value.trim() || sending}
        className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center disabled:opacity-40"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}
