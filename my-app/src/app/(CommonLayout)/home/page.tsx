import MainBtn from '@/components/common/MainBtn';
import PostCard from '@/components/home/PostCard';

export default function page() {
  return (
    <main className="flex flex-col gap-32pxr p-32pxr">
      <article className="flex w-796pxr items-center justify-between self-stretch rounded-lg border border-dashed border-[#00C471] bg-[rgba(234,251,242,0.30)] p-20pxr">
        🌱 오늘 배운 지식을 기록하고 공유해보세요.
        <MainBtn>글쓰기</MainBtn>
      </article>
      <PostCard
        subtitle="React"
        title="Next.js에서 SSR 이해하기"
        content="Next.js에서는 서버에서 HTML을 먼저 렌더링할 수 있다..."
        commentCount={12}
        likeCount={34}
      />
    </main>
  );
}
