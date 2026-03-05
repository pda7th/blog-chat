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
        <div className="w-full md:w-[320px] bg-[#F9F9F9] rounded-[24px] p-10 flex flex-col gap-6">
            <h3 className="text-[19px] font-bold text-[#333333]">계정 관리</h3>

            <div className="flex flex-col gap-5 text-[15px] font-semibold text-[#888888]">
                <button
                    onClick={() => router.push('/mypage/edit')}
                    className="text-left hover:text-[#00B461] transition-colors"
                >
                    정보 수정
                </button>
                <div className="border-b border-gray-100/50"></div>
                <button
                    onClick={handleDeactivate}
                    className="text-left text-[#FF7070] font-bold mt-2"
                >
                    회원 탈퇴
                </button>
            </div>
        </div>
    );
}
