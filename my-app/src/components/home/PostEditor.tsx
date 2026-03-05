'use client';

import MainBtn from '../common/MainBtn';
import { PictureIcon } from '../../../public/icon';
import { useState } from 'react';
import CategoryDropdown from './CategoryDropdown';
import { type PostCategory } from '@/lib/constants';

type WriteCategory = Exclude<PostCategory, '전체'>;

export default function PostEditor() {
  const [category, setCategory] = useState<WriteCategory>('수업');

  return (
    <section className="w-796pxr rounded-2xl border border-gray-200 bg-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)]">
      <header className="flex flex-col gap-12pxr border-b border-gray-100 bg-gray-50 p-32pxr">
        <div className="flex items-center gap-8pxr">
          <button className="rounded bg-emerald-500 px-12pxr py-6pxr">
            <span className="fonts-chipActive">수업 템플릿</span>
          </button>

          <button className="rounded border border-gray-200 bg-white px-12pxr py-6pxr">
            <span className="fonts-chipInactive">회고 템플릿</span>
          </button>
        </div>

        <input
          className="fonts-editorTitle w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-300"
          placeholder="제목을 입력하세요"
        />

        <CategoryDropdown value={category} onChange={setCategory} />
      </header>

      <div className="flex items-center gap-8pxr border-b border-gray-100 px-24pxr py-12pxr">
        <button className="rounded p-8pxr text-zinc-600">
          <PictureIcon />
        </button>
      </div>

      <div className="p-40pxr">
        <textarea
          className="fonts-editorContent min-h-288pxr w-full resize-none text-gray-900 outline-none placeholder:text-gray-400"
          placeholder="지식의 씨앗을 심어주세요..."
        />
      </div>

      <footer className="flex items-center justify-end gap-12pxr border-t border-gray-100 p-24pxr">
        <MainBtn className="bg-[#F1F3F5]">
          <span className="fonts-btnDisabled">취소</span>
        </MainBtn>

        <MainBtn className="px-10">
          <span className="fonts-btnPrimary">지식 심기</span>
        </MainBtn>
      </footer>
    </section>
  );
}
