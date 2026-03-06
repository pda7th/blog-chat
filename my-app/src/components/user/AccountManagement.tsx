'use client';

import { useRouter } from 'next/navigation';

export default function AccountManagement() {
    const router = useRouter();

    const handleDeactivate = async () => {
        if (!confirm('정말 탈퇴하시겠습니까? 계정과 모든 지식 정보가 즉시 삭제되며 복구가 불가능합니다.')) {
            return;
        }

        try {
            const res = await fetch('/api/user/delete', { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || '탈퇴 처리 중 오류가 발생했습니다.');

            alert('그동안 감사했습니다. 회원 탈퇴가 처리되었습니다. 👋');
            // 클라이언트 측 세션 정리 및 홈으로 이동
            window.location.href = '/';
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="flex w-full flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:w-[320px]">
            <div className="flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-[#00C471]" />
                <h3 className="text-[17px] font-bold text-[#333333]">계정 관리</h3>
            </div>

            <div className="flex flex-col gap-1">
                <button
                    onClick={() => router.push('/mypage/edit')}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-semibold text-[#666666] transition-all duration-150 hover:bg-green-50 hover:text-[#00C471]"
                >
                    <span>정보 수정</span>
                    <span className="text-gray-300">›</span>
                </button>
                <div className="mx-4 border-b border-gray-100"></div>
                <button
                    onClick={handleDeactivate}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-bold text-[#FF7070] transition-all duration-150 hover:bg-red-50"
                >
                    <span>회원 탈퇴</span>
                    <span className="text-red-200">›</span>
                </button>
            </div>
        </div>
    );
}
