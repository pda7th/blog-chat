import { Suspense } from 'react';
import PostEditor from '@/components/home/PostEditor';

export default function page() {
  return (
    <main className="flex h-full flex-col p-32pxr">
      <Suspense>
        <PostEditor />
      </Suspense>
    </main>
  );
}
