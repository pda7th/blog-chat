'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { CATEGORY_EMOJI, POST_CATEGORIES, type PostCategory } from '@/lib/constants';
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

        <section className="flex shrink-0 items-center">
          <div className="fonts-navBar flex h-36pxr w-36pxr items-center justify-center rounded-full bg-green-500 text-white">
            {initial}
          </div>
        </section>
      </div>
    </nav>
  );
}
