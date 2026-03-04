'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { CATEGORY_EMOJI, POST_CATEGORIES, type PostCategory } from '@/lib/constants';

export default function NavBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const activeCategory = (searchParams.get('category') ?? '전체') as PostCategory;
  const initial = session?.user?.name?.charAt(0) ?? '?';

  const handleCategoryClick = (category: PostCategory) => {
    if (category === '전체') {
      router.push('/home');
    } else {
      router.push(`/home?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <nav className="flex items-center justify-between h-[67px] px-8 bg-white border-b border-gray-100">
      {/* 로고 */}
      <div className="flex items-center gap-1 min-w-[120px]">
        <span className="text-[18px] font-black text-green-500 tracking-tight">싹심기</span>
        <span className="text-base">🌱</span>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center gap-2">
        {POST_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          const emoji = CATEGORY_EMOJI[category];
          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={[
                'flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all',
                isActive
                  ? 'bg-green-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-500',
              ].join(' ')}
            >
              {emoji && <span className="text-sm leading-none">{emoji}</span>}
              <span>{category}</span>
            </button>
          );
        })}
      </div>

      {/* 우측: 출석 버튼 + 아바타 */}
      <div className="flex items-center gap-3 min-w-[120px] justify-end">
        <button className="px-4 py-2 rounded-full border border-green-400 text-green-500 text-sm font-medium hover:bg-green-50 transition-colors whitespace-nowrap">
          오늘 출석전
        </button>
        <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
          {initial}
        </div>
      </div>
    </nav>
  );
}
