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

type WriteCategory = Exclude<PostCategory, '전체'>;
const WRITE_CATEGORIES = POST_CATEGORIES.filter((c) => c !== '전체') as WriteCategory[];

export default function PostEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [image3, setImage3] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<'수업' | '회고' | null>(null);

  const initialCategory = (): WriteCategory => {
    const param = searchParams.get('category') as WriteCategory | null;
    return param && WRITE_CATEGORIES.includes(param) ? param : '수업';
  };
  const [category, setCategory] = useState<WriteCategory>(initialCategory);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, TextStyle, Color, FontFamily],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-288pxr w-full outline-none prose prose-sm max-w-none',
      },
    },
  });

  const applyTemplate = (type: '수업' | '회고') => {
    editor?.commands.setContent(TEMPLATES[type]);
    setActiveTemplate(type);
  };

  const handleSubmit = async () => {
    const content = editor?.getHTML() ?? '';
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      await createPost({ title, content, category, image1, image2, image3 });
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
        {/* 템플릿 버튼 */}
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
        </div>

        <input
          className="fonts-editorTitle w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-300"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <CategoryDropdown value={category} onChange={setCategory} />
      </header>

      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-4pxr border-b border-gray-100 px-24pxr py-12pxr">
        {/* 볼드 */}
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`rounded px-8pxr py-4pxr text-sm font-bold transition-colors ${editor?.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          B
        </button>

        {/* 이탤릭 */}
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`rounded px-8pxr py-4pxr text-sm italic transition-colors ${editor?.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          I
        </button>

        {/* 취소선 */}
        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`rounded px-8pxr py-4pxr text-sm line-through transition-colors ${editor?.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          S
        </button>

        <div className="h-16pxr w-px bg-gray-200" />

        {/* 글머리 목록 */}
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`rounded px-8pxr py-4pxr text-sm transition-colors ${editor?.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          • 목록
        </button>

        {/* 번호 목록 */}
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`rounded px-8pxr py-4pxr text-sm transition-colors ${editor?.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
          1. 목록
        </button>

        <div className="h-16pxr w-px bg-gray-200" />

        {/* 폰트 선택 */}
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

        {/* 색상 선택 */}
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

        {/* 이미지 업로드 */}
        <div className="flex items-center gap-8pxr">
          <ImageUpload folder="posts" onUpload={setImage1} />
          {image1 && <img src={image1} alt="이미지1" className="h-8 w-8 rounded object-cover" />}
        </div>
        {image1 && (
          <div className="flex items-center gap-8pxr">
            <ImageUpload folder="posts" onUpload={setImage2} />
            {image2 && <img src={image2} alt="이미지2" className="h-8 w-8 rounded object-cover" />}
          </div>
        )}
        {image2 && (
          <div className="flex items-center gap-8pxr">
            <ImageUpload folder="posts" onUpload={setImage3} />
            {image3 && <img src={image3} alt="이미지3" className="h-8 w-8 rounded object-cover" />}
          </div>
        )}
      </div>

      {/* 에디터 본문 */}
      <div className="p-40pxr">
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
