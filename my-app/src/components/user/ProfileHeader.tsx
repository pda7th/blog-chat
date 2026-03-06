'use client';

import { useSession } from '@/lib/auth-client';
import LogoutButton from '@/components/auth/LogoutButton';

export default function ProfileHeader() {
    const { data: session } = useSession();

    if (!session) return null;

    const { user } = session;
    const initial = user.name?.charAt(0) ?? '?';

    const levelConfig: Record<string, { label: string, color: string }> = {
        'BEGINNER': { label: '새싹', color: 'text-green-500 border-green-200 bg-green-50' },
        'INTERMEDIATE': { label: '성장', color: 'text-blue-500 border-blue-200 bg-blue-50' },
        'EXPERT': { label: '나무', color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
    };

    const currentLevel = levelConfig[user.level || 'BEGINNER'] || levelConfig['BEGINNER'];

    return (
        <div className="w-full">
            {/* 상단 그린 배너 */}
            <div className="h-[200px] w-full rounded-3xl bg-gradient-to-br from-[#00C471] via-emerald-500 to-teal-500 shadow-md shadow-green-200"></div>

            {/* 프로필 콘텐츠 영역 */}
            <div className="relative px-8 flex flex-col items-start bg-transparent">
                {/* 프로필 아바타 */}
                <div className="absolute -top-[70px] left-12">
                    <div className="h-[140px] w-[140px] overflow-hidden rounded-full border-[5px] border-white bg-white shadow-xl ring-4 ring-green-100 flex items-center justify-center">
                        {user.image ? (
                            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-4xl font-black text-[#00C471]">
                                {user.nickname || user.name ? (user.nickname || user.name).charAt(0) : '?'}
                            </div>
                        )}
                    </div>
                </div>

                {/* 유저명, 한줄소개, 버튼 */}
                <div className="w-full pt-[95px] flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[32px] font-black text-[#222222] tracking-tighter leading-tight">
                                {user.nickname || user.name}
                            </span>
                            <div className={`flex items-center gap-1 rounded-full border px-3 py-1 text-[12px] font-bold shadow-sm ${currentLevel.color}`}>
                                {currentLevel.label} 🌿
                            </div>
                        </div>
                        <p className="text-[#999999] text-[15px] font-medium leading-relaxed">
                            학습한 내용을 꾸준히 기록하는 공간입니다.
                        </p>
                    </div>

                    <div className="flex gap-2 pt-3">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
