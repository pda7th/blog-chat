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
      <article className="flex w-full items-center justify-between self-stretch rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-24pxr shadow-sm">
        <div className="flex items-center gap-12pxr">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-lg">🌱</span>
          <div>
            <p className="text-sm font-bold text-green-800">오늘 배운 지식을 기록해보세요</p>
            <p className="text-xs text-green-600/70 mt-1">꾸준한 기록이 성장을 만듭니다</p>
          </div>
        </div>
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
            authorName={post.authorName}
            authorNickname={post.authorNickname}
            authorProfileImage={post.authorProfileImage}
          />
        </div>
      ))}

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
          <span>불러오는 중...</span>
        </div>
      )}

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
