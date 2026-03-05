'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';
import ImageUpload from '@/components/common/ImageUpload/ImageUpload';

const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

export default function SignUpForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState(DEFAULT_IMAGE);
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signUp.email({
                email,
                password,
                name: nickname,
                nickname,
                userProfileImageUrl: profileImageUrl,
            }, {
                onSuccess: () => {
                    alert('회원가입 성공!');
                    router.push('/home');
                },
                onError: (ctx) => {
                    alert(ctx.error.message || '가입 실패');
                }
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignup} className="flex flex-col gap-6 text-black">
            <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-600">프로필 사진</span>
                <ImageUpload
                    folder="profiles"
                    onUpload={setProfileImageUrl}
                    currentUrl={profileImageUrl}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">닉네임</label>
                <input
                    required
                    className="rounded-lg border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">이메일</label>
                <input
                    required
                    type="email"
                    className="rounded-lg border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">비밀번호</label>
                <input
                    required
                    type="password"
                    className="rounded-lg border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="8자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button
                disabled={loading}
                className="mt-2 rounded-xl bg-green-500 py-3 font-bold text-white hover:bg-green-600 disabled:bg-gray-300"
            >
                {loading ? '가입 중...' : '회원가입 하기'}
            </button>
        </form>
    );
}
