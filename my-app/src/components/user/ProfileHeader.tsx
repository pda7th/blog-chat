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
            {/* 상단 그린 배너 - 상단을 가득 채우는 느낌으로 */}
            <div className="h-[200px] w-full bg-[#00B461] rounded-[40px] shadow-sm"></div>

            {/* 프로필 콘텐츠 영역 - 평면화 */}
            <div className="relative px-8 flex flex-col items-start bg-transparent">
                {/* 프로필 아바타 */}
                <div className="absolute -top-[70px] left-12">
                    <div className="h-[140px] w-[140px] rounded-full border-[6px] border-white bg-white shadow-xl overflow-hidden flex items-center justify-center">
                        {user.image ? (
                            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full bg-[#E6F7ED] flex items-center justify-center text-4xl font-black text-[#00B461]">
                                {user.nickname || user.name ? (user.nickname || user.name).charAt(0) : '?'}
                            </div>
                        )}
                    </div>
                </div>

                {/* 유저명, 한줄소개, 버튼 */}
                <div className="w-full pt-[95px] flex justify-between items-start">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                            <span className="text-[36px] font-black text-[#333333] tracking-tighter leading-tight">
                                {user.nickname || user.name}
                            </span>
                            <div className={`flex items-center gap-1 rounded-[6px] border px-2.5 py-1 text-[13px] font-bold ${currentLevel.color}`}>
                                {currentLevel.label} 🌿
                            </div>
                        </div>
                        <p className="text-[#888888] text-[17px] font-medium leading-relaxed">
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
