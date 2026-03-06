'use client';

import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const confirmLogout = confirm('정말 로그아웃 하시겠습니까?');
        if (!confirmLogout) return;

        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        // 로그아웃 성공하면 로그인 페이지로 보내고, 
                        // 세션 정보를 비우기 위해 페이지를 한 번 새로고침
                        router.push('/home');
                        router.refresh();
                    },
                }
            });
        } catch (error) {
            console.error('로그아웃 에러:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="rounded-full border border-gray-200 bg-white px-5 py-2 text-[13px] font-semibold text-gray-500 shadow-sm transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 active:scale-95"
        >
            로그아웃
        </button>
    );
}
