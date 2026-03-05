'use client';

import { useState } from 'react';
import ImageUpload from '@/components/common/ImageUpload/ImageUpload';

export default function TestUploadPage() {
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [postUrl, setPostUrl] = useState<string | null>(null);

  return (
    <div className="max-w-lg mx-auto p-8 flex flex-col gap-10">
      <h1 className="text-xl font-bold">S3 업로드 테스트</h1>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-gray-700">프로필 이미지</h2>
        <ImageUpload folder="profiles" onUpload={setProfileUrl} />
        {profileUrl && (
          <a href={profileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 break-all">
            {profileUrl}
          </a>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-gray-700">포스트 이미지</h2>
        <ImageUpload folder="posts" onUpload={setPostUrl} />
        {postUrl && (
          <a href={postUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 break-all">
            {postUrl}
          </a>
        )}
      </section>
    </div>
  );
}
