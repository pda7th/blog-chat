'use client';

import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainBtn from '@/components/common/MainBtn';
import PostCard from '@/components/home/PostCard';
import { fetchPosts, type PostSummary } from '@/lib/post';
import { type PostCategory } from '@/lib/constants';

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = (searchParams.get('category') ?? '전체') as PostCategory;
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const loadPosts = useCallback(
    async (currentPage: number) => {
      if (isLoadingRef.current || !hasMoreRef.current) return;
      isLoadingRef.current = true;
      setIsLoading(true);
      try {
        const data = await fetchPosts({ category, page: currentPage, pageSize: 10 });
        setPosts((prev) => (currentPage === 1 ? data.items : [...prev, ...data.items]));
        hasMoreRef.current = data.items.length === 10;
        setHasMore(data.items.length === 10);
      } catch (err) {
        console.error(err);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [category],
  );

  // 카테고리 바뀌면 초기화 후 1페이지 즉시 로드
  useEffect(() => {
    setPosts([]);
    setPage(1);
    hasMoreRef.current = true;
    isLoadingRef.current = false;
    setHasMore(true);
    setIsLoading(false);
    loadPosts(1);
  }, [category, loadPosts]);

  // 무한스크롤: page가 1 초과일 때만 추가 로드
  useEffect(() => {
    if (page === 1) return;
    loadPosts(page);
  }, [page, loadPosts]);

  // IntersectionObserver 설정
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        setPage((prev) => prev + 1);
      }
    });

    if (bottomRef.current) observerRef.current.observe(bottomRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore, isLoading]);

  return (
    <main className="flex flex-col gap-32pxr py-32pxr">
      <article className="flex w-full items-center justify-between self-stretch rounded-lg border border-dashed border-[#00C471] bg-[rgba(234,251,242,0.30)] p-20pxr">
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
            postId={post.postId}
            subtitle={post.category}
            title={post.title}
            content={post.content}
            commentCount={post.commentCount}
            likeCount={post.likeCount}
            liked={post.liked}
          />
        </div>
      ))}

      {isLoading && <p className="text-center text-sm text-gray-400">불러오는 중...</p>}

      <div ref={bottomRef} className="h-1" />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomePageContent />
    </Suspense>
  );
}
