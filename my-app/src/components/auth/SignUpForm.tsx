'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth-client';
import { PictureIcon } from '../../../public/icon';

const DEFAULT_IMAGE = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

export default function SignUpForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState(DEFAULT_IMAGE);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'profiles');

            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || '업로드 실패');
            setProfileImageUrl(data.url);
        } catch (err) {
            console.error(err);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signUp.email({
                email,
                password,
                name: nickname,
                nickname,
                image: profileImageUrl,
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
            <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">프로필 사진</span>
                <div
                    className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 cursor-pointer hover:border-green-400 transition-all shadow-sm"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] text-green-600 font-bold">UP</span>
                        </div>
                    ) : (
                        <>
                            <img
                                src={profileImageUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PictureIcon />
                            </div>
                        </>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
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
                disabled={loading || uploading}
                className="mt-2 rounded-xl bg-green-500 py-3 font-bold text-white hover:bg-green-600 disabled:bg-gray-300"
            >
                {loading ? '가입 중...' : '회원가입 하기'}
            </button>
        </form>
    );
}
