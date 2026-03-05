'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { CATEGORY_EMOJI, POST_CATEGORIES, type PostCategory } from '@/lib/constants';
import LogoutButton from '@/components/auth/LogoutButton';
import NavItem from './NavItem';

export default function NavBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const activeCategory = (searchParams.get('category') ?? '전체') as PostCategory;
  const initial = session?.user?.name?.charAt(0) ?? '?';

  const handleCategoryClick = (category: PostCategory) => {
    if (category === '전체') router.push('/home');
    else router.push(`/home?category=${encodeURIComponent(category)}`);
  };

  return (
    <nav className="flex items-center gap-18pxr border-b border-gray-100 bg-white py-35pxr">
      <div className="flex shrink-0 items-center gap-4pxr">
        <span className="fonts-logo tracking-tight text-green-500">싹심기</span>
        <span>🌱</span>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between">
        {/* 카테고리 영역 */}
        <section className="flex min-w-0 flex-1 items-center">
          <div className="flex min-w-0 flex-1 items-center gap-8pxr overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {POST_CATEGORIES.map((category) => (
              <NavItem
                key={category}
                category={category}
                emoji={CATEGORY_EMOJI[category]}
                isActive={activeCategory === category}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </section>

        <section className="flex shrink-0 items-center"></section>
      </div>
      {/* 우측: 출석 버튼 + 아바타 */}
      <div className="flex min-w-[120px] items-center justify-end gap-3">
        {session ? (
          // 1. 로그인 상태인 경우: 로그아웃 버튼 + 프로필 이미지
          <>
            <LogoutButton />
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
              {initial}
            </div>
          </>
        ) : (
          // 2. 로그인하지 않은 경우: 로그인 버튼 표시
          <button
            onClick={() => router.push('/login')}
            className="rounded-full border border-green-500 px-4 py-2 text-sm font-medium text-green-500 transition-colors hover:bg-green-50">
            로그인
          </button>
        )}
      </div>
    </nav>
  );
}
