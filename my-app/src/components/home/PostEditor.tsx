'use client';

import MainBtn from '../common/MainBtn';
import { useState } from 'react';
import CategoryDropdown from './CategoryDropdown';
import ImageUpload from '@/components/common/ImageUpload/ImageUpload';
import { POST_CATEGORIES, type PostCategory, TEMPLATES, COLORS, FONTS } from '@/lib/constants';
import { createPost } from '@/lib/post';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { ImageResize } from 'tiptap-extension-resize-image';

type WriteCategory = Exclude<PostCategory, '전체'>;
const WRITE_CATEGORIES = POST_CATEGORIES.filter((c) => c !== '전체') as WriteCategory[];

export default function PostEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<'수업' | '회고' | null>(null);
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);

  const initialCategory = (): WriteCategory => {
    const param = searchParams.get('category') as WriteCategory | null;
    return param && WRITE_CATEGORIES.includes(param) ? param : '수업';
  };
  const [category, setCategory] = useState<WriteCategory>(initialCategory);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, TextStyle, Color, FontFamily, ImageResize],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[400px] w-full outline-none prose prose-sm max-w-none',
      },
    },
  });

  const applyTemplate = (type: '수업' | '회고') => {
    editor?.commands.setContent(TEMPLATES[type]);
    setActiveTemplate(type);
  };

  const handleImageUpload = (url: string) => {
    const images =
      editor
        ?.getJSON()
        .content?.flatMap((node) =>
          node.type === 'image' ? [node] : (node.content?.filter((n) => n.type === 'image') ?? []),
        ) ?? [];

    if (images.length >= 3) {
      alert('이미지는 최대 3장까지 업로드 가능합니다.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor?.chain().focus() as any).setImage({ src: url }).run();
    setIsHeaderOpen(false);
  };

  const handleSubmit = async () => {
    const content = editor?.getHTML() ?? '';
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      await createPost({ title, content, category });
      router.push('/home');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)]">
      {/* 헤더 토글 버튼 */}
      <button
        onClick={() => setIsHeaderOpen((prev) => !prev)}
        className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-32pxr py-12pxr text-sm text-gray-400 transition-colors hover:bg-gray-100">
        <span>{isHeaderOpen ? '제목 / 템플릿 접기' : `${title || '제목 없음'} · ${category}`}</span>
        <span
          className="transition-transform duration-200"
          style={{ transform: isHeaderOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▲
        </span>
      </button>

      {/* 접히는 헤더 */}
      {isHeaderOpen && (
        <header className="flex flex-col gap-12pxr border-b border-gray-100 bg-gray-50 p-32pxr">
          <div className="flex items-center gap-8pxr">
            <button
              onClick={() => applyTemplate('수업')}
              className={`rounded px-12pxr py-6pxr transition-colors ${activeTemplate === '수업' ? 'bg-emerald-500' : 'border border-gray-200 bg-white hover:border-emerald-400'}`}>
              <span className={activeTemplate === '수업' ? 'fonts-chipActive' : 'fonts-chipInactive'}>수업 템플릿</span>
            </button>
            <button
              onClick={() => applyTemplate('회고')}
              className={`rounded px-12pxr py-6pxr transition-colors ${activeTemplate === '회고' ? 'bg-emerald-500' : 'border border-gray-200 bg-white hover:border-emerald-400'}`}>
              <span className={activeTemplate === '회고' ? 'fonts-chipActive' : 'fonts-chipInactive'}>회고 템플릿</span>
            </button>
            <CategoryDropdown value={category} onChange={setCategory} />
          </div>

          <input
            className="fonts-editorTitle w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-300"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </header>
      )}

      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-4pxr border-b border-gray-100 px-24pxr py-12pxr">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`rounded px-8pxr py-4pxr text-sm font-bold transition-colors ${editor?.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          B
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`rounded px-8pxr py-4pxr text-sm italic transition-colors ${editor?.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          I
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`rounded px-8pxr py-4pxr text-sm line-through transition-colors ${editor?.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          S
        </button>
        <div className="h-16pxr w-px bg-gray-200" />
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`rounded px-8pxr py-4pxr text-sm transition-colors ${editor?.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          • 목록
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`rounded px-8pxr py-4pxr text-sm transition-colors ${editor?.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          1. 목록
        </button>
        <div className="h-16pxr w-px bg-gray-200" />
        <select
          onChange={(e) => {
            const font = e.target.value;
            if (font === '기본') editor?.chain().focus().unsetFontFamily().run();
            else editor?.chain().focus().setFontFamily(font).run();
          }}
          className="rounded border border-gray-200 px-8pxr py-4pxr text-sm outline-none">
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <div className="h-16pxr w-px bg-gray-200" />
        <div className="flex items-center gap-4pxr">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => editor?.chain().focus().setColor(color).run()}
              className="h-16pxr w-16pxr rounded-full border border-gray-200 transition-transform hover:scale-110"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="h-16pxr w-px bg-gray-200" />
        <ImageUpload folder="posts" onUpload={handleImageUpload} />
      </div>

      {/* 에디터 본문 */}
      <div className="flex-1 overflow-y-auto px-40pxr pb-40pxr pt-24pxr">
        <EditorContent editor={editor} />
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
