'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainBtn from '@/components/common/MainBtn';
import PostCard from '@/components/home/PostCard';
import { fetchPosts, type PostSummary } from '@/lib/post';
import { type PostCategory } from '@/lib/constants';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = (searchParams.get('category') ?? '전체') as PostCategory;
  const [posts, setPosts] = useState<PostSummary[]>([]);

  useEffect(() => {
    fetchPosts({ category })
      .then((data) => setPosts(data.items))
      .catch(console.error);
  }, [category]); // category 바뀔 때마다 재조회

  return (
    <main className="flex flex-col gap-32pxr py-32pxr">
      <article className="flex w-796pxr items-center justify-between self-stretch rounded-lg border border-dashed border-[#00C471] bg-[rgba(234,251,242,0.30)] p-20pxr">
        🌱 오늘 배운 지식을 기록하고 공유해보세요.
        <MainBtn
          className="text-white"
          onClick={() => router.push(`/home/write?category=${encodeURIComponent(category)}`)}>
          글쓰기
        </MainBtn>
      </article>

      {posts.map((post) => (
        <div key={post.postId} onClick={() => router.push(`/home/${post.postId}`)} className="cursor-pointer">
          <PostCard
            subtitle={post.category}
            title={post.title}
            content={post.content}
            commentCount={post.commentCount}
            likeCount={post.likeCount}
          />
        </div>
      ))}
    </main>
  );
}
