'use client';

import { useEffect, useRef, useState } from 'react';
import { POST_CATEGORIES, type PostCategory } from '@/lib/constants';

type Props = {
  value: Exclude<PostCategory, '전체'>;
  onChange: (next: Exclude<PostCategory, '전체'>) => void;
};

const WRITE_CATEGORIES = POST_CATEGORIES.filter((c): c is Exclude<PostCategory, '전체'> => c !== '전체');

export default function CategoryDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  // 바깥 클릭 시 닫기
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  const handleSelect = (c: Exclude<PostCategory, '전체'>) => {
    onChange(c);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative w-fit">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-8pxr rounded border border-zinc-200 bg-white px-16pxr py-8pxr"
        aria-haspopup="listbox"
        aria-expanded={open}>
        <span className="fonts-categoryBadge">{value}</span>
        <span className="ml-4pxr text-zinc-400">▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-20 mt-8pxr w-220pxr overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0px_8px_20px_-8px_rgba(0,0,0,0.2)]">
          {WRITE_CATEGORIES.map((c) => {
            const active = c === value;

            return (
              <button
                key={c}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => handleSelect(c)}
                className={[
                  'flex w-full items-center gap-8pxr px-12pxr py-10pxr text-left',
                  active ? 'bg-emerald-50' : 'bg-white',
                  'hover:bg-gray-50',
                ].join(' ')}>
                <span className="fonts-categoryBadge">{c}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
