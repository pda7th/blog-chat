'use client';

import { signIn } from '@/lib/auth-client';
import { useState } from 'react';

export default function SocialLoginButtons() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleSocialLogin = async (provider: 'google' | 'github' | 'kakao') => {
        setLoading(provider);
        try {
            await signIn.social({
                provider,
                callbackURL: '/', // 메인 페이지로 이동
            });
        } catch (error) {
            console.error(`${provider} 로그인 에러:`, error);
            alert('로그인 시도 중 오류가 발생했습니다.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {/* 구글 버튼 */}
            <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={!!loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
                {loading === 'google' ? '연결 중...' : '구글로 계속하기'}
            </button>

            {/* 깃허브 버튼 */}
            <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={!!loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#24292F] py-3 font-medium text-white hover:bg-[#1b1f23] active:scale-95"
            >
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" className="h-5 w-5 invert" />
                {loading === 'github' ? '연결 중...' : 'GitHub으로 계속하기'}
            </button>

        </div>
    );
}

