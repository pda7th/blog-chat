'use client';

import MainBtn from '../common/MainBtn';
import { useState } from 'react';
import CategoryDropdown from './CategoryDropdown';
import ImageUpload from '@/components/common/ImageUpload/ImageUpload';
import { type PostCategory } from '@/lib/constants';
import { createPost } from '@/lib/post';
import { useRouter } from 'next/navigation';

type WriteCategory = Exclude<PostCategory, '전체'>;

export default function PostEditor() {
  const router = useRouter();
  const [category, setCategory] = useState<WriteCategory>('수업');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [image3, setImage3] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      await createPost({ title, content, category, image1 });
      router.push('/home');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <CategoryDropdown value={category} onChange={setCategory} />
      </header>

      {/* 이미지 업로드 */}
      <div className="flex items-center gap-8pxr border-b border-gray-100 px-24pxr py-12pxr">
        <div className="flex items-center gap-8pxr">
          <ImageUpload folder="posts" onUpload={setImage1} />
          {image1 && <img src={image1} alt="이미지1" className="h-12 w-12 rounded object-cover" />}
        </div>

        {image1 && (
          <div className="flex items-center gap-8pxr">
            <ImageUpload folder="posts" onUpload={setImage2} />
            {image2 && <img src={image2} alt="이미지2" className="h-12 w-12 rounded object-cover" />}
          </div>
        )}

        {image2 && (
          <div className="flex items-center gap-8pxr">
            <ImageUpload folder="posts" onUpload={setImage3} />
            {image3 && <img src={image3} alt="이미지3" className="h-12 w-12 rounded object-cover" />}
          </div>
        )}
      </div>

      <div className="p-40pxr">
        <textarea
          className="fonts-editorContent min-h-288pxr w-full resize-none text-gray-900 outline-none placeholder:text-gray-400"
          placeholder="지식의 씨앗을 심어주세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <footer className="flex items-center justify-end gap-12pxr border-t border-gray-100 p-24pxr">
        <MainBtn className="bg-[#F1F3F5]" onClick={() => router.back()}>
          <span className="fonts-btnDisabled">취소</span>
        </MainBtn>

        <MainBtn className="px-10" onClick={handleSubmit} disabled={isSubmitting}>
          <span className="fonts-btnPrimary">{isSubmitting ? '저장 중...' : '지식 심기'}</span>
        </MainBtn>
      </footer>
    </section>
  );
}
