'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';

export default function LogInForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signIn.email({
                email,
                password,
            }, {
                onSuccess: () => {
                    alert('로그인 성공! 🎉');
                    router.push('/home');
                    router.refresh();
                },
                onError: (ctx) => {
                    alert(ctx.error.message || '이메일 또는 비밀번호가 틀렸습니다.');
                }
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-6 text-black">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">이메일 주소</label>
                <input
                    required
                    type="email"
                    className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm outline-none transition-all duration-150 focus:ring-2 focus:ring-green-400/40 focus:border-green-400"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">비밀번호</label>
                <input
                    required
                    type="password"
                    className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm outline-none transition-all duration-150 focus:ring-2 focus:ring-green-400/40 focus:border-green-400"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button
                disabled={loading}
                className="mt-2 rounded-xl bg-[#00C471] py-3 font-bold text-white shadow-sm transition-all duration-150 hover:bg-green-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
                {loading ? '로그인 중...' : '로그인'}
            </button>
        </form>
    );
}
