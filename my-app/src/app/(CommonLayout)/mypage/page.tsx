'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProfileHeader from '@/components/user/ProfileHeader';
import MyPostList from '@/components/user/MyPostList';
import AccountManagement from '@/components/user/AccountManagement';

export default function MyPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
    </div>
  );

  if (!session) return null;

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        {/* 1. 상단 섹션 (배너 + 프로필 정보) */}
        <ProfileHeader />

        {/* 2. 하단 섹션 (글 목록 + 계정 관리) */}
        <div className="mt-16 flex flex-col lg:flex-row gap-16 items-start">
          {/* 왼쪽: 내가 심은 지식 */}
          <div className="flex-1">
            <MyPostList />
          </div>

          {/* 오른쪽: 계정 관리 센터 */}
          <div className="w-full lg:w-80">
            <AccountManagement />
          </div>
        </div>
      </div>
    </main>
  );
}
