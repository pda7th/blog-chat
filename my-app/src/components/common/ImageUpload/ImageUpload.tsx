'use client';

import { useRef, useState } from 'react';

type UploadFolder = 'profiles' | 'posts';

interface ImageUploadProps {
  folder: UploadFolder;
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export default function ImageUpload({ folder, onUpload, currentUrl }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isProfile = folder === 'profiles';

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? '업로드에 실패했습니다.');
        setPreview(currentUrl ?? null);
        return;
      }

      onUpload(data.url);
    } catch {
      setError('업로드 중 오류가 발생했습니다.');
      setPreview(currentUrl ?? null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className={[
          'relative overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors',
          isProfile ? 'w-24 h-24 rounded-full' : 'w-full h-48 rounded-xl',
          loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="미리보기" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">{isProfile ? '프로필 사진' : '이미지 추가'}</span>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-white text-xs">업로드 중...</span>
          </div>
        )}
      </button>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
