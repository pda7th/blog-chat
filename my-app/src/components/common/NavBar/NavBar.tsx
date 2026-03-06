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
  const handleCategoryClick = (category: PostCategory) => {
    if (category === '전체') router.push('/home');
    else router.push(`/home?category=${encodeURIComponent(category)}`);
  };

  return (
    <nav className="flex items-center gap-18pxr border-b border-gray-100 bg-white/95 py-20pxr shadow-sm backdrop-blur-sm">
      <button
        onClick={() => router.push('/home')}
        className="flex shrink-0 items-center gap-6pxr"
      >
        <span className="fonts-logo tracking-tight text-[#00C471]">싹심기</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-xs">🌱</span>
      </button>
      <div className="flex min-w-0 flex-1 items-center justify-between">
        {/* 카테고리 영역 */}
        <section className="flex min-w-0 flex-1 items-center">
          <div className="flex min-w-0 flex-1 items-center gap-6pxr overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
      {/* 우측: 아바타 */}
      <div className="flex min-w-[120px] items-center justify-end gap-3">
        {session ? (
          // 1. 로그인 상태인 경우: 로그아웃 버튼 + 프로필 이미지
          <>
            <LogoutButton />
            <button
              onClick={() => router.push('/mypage')}
              className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-gray-100 bg-gray-50 shadow-sm transition-all duration-200 hover:border-green-300 hover:ring-2 hover:ring-green-400/30 active:scale-95"
            >
              <img
                src={session.user.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                alt="My Page"
                className="h-full w-full object-cover"
              />
            </button>
          </>
        ) : (
          // 2. 로그인하지 않은 경우: 로그인 버튼 표시
          <button
            onClick={() => router.push('/login')}
            className="rounded-full bg-[#00C471] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-600 active:scale-95">
            로그인
          </button>
        )}
      </div>
    </nav>
  );
}
