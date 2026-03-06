'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainBtn from '@/components/common/MainBtn';
import CategoryDropdown from '@/components/home/CategoryDropdown';
import ImageUpload from '@/components/common/ImageUpload/ImageUpload';
import { fetchPost, updatePost } from '@/lib/post';
import { type PostCategory, COLORS, FONTS } from '@/lib/constants';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Image from '@tiptap/extension-image';

type WriteCategory = Exclude<PostCategory, '전체'>;

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '200',
        renderHTML: (attributes) => ({ width: attributes.width }),
        parseHTML: (element) => element.getAttribute('width'),
      },
    };
  },
});

export default function PostEditPage() {
  const { postId } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<WriteCategory>('수업');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, TextStyle, Color, FontFamily, CustomImage.configure({ inline: false })],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[400px] w-full outline-none prose prose-sm max-w-none',
      },
    },
  });

  useEffect(() => {
    fetchPost(Number(postId))
      .then((post) => {
        setTitle(post.title);
        setCategory(post.category as WriteCategory);
        editor?.commands.setContent(post.content);
      })
      .catch(console.error);
  }, [postId, editor]);

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
  };

  const handleSubmit = async () => {
    const content = editor?.getHTML() ?? '';
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      await updatePost(Number(postId), { title, content, category });
      router.push(`/home/${postId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-32pxr">
      <section className="w-796pxr rounded-2xl border border-gray-200 bg-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)]">
        <header className="flex flex-col gap-12pxr border-b border-gray-100 bg-gray-50 p-32pxr">
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
            <span className="fonts-btnPrimary">{isSubmitting ? '저장 중...' : '수정 완료'}</span>
          </MainBtn>
        </footer>
      </section>
    </main>
  );
}
