'use client';

import { PictureIcon } from '../../../../public/icon';
import { useRef, useState } from 'react';

type UploadFolder = 'profiles' | 'posts';

interface ImageUploadProps {
  folder: UploadFolder;
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export default function ImageUpload({ folder, onUpload, currentUrl }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? '업로드에 실패했습니다.');
        return;
      }

      onUpload(data.url);
    } catch {
      setError('업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className={[
          'rounded p-8pxr text-zinc-600 transition-colors hover:bg-gray-100',
          loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        ].join(' ')}>
        {loading ? <span className="text-xs text-gray-400">업로드 중...</span> : <PictureIcon />}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}

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
