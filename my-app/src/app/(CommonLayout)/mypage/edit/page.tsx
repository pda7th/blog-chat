'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, authClient } from '@/lib/auth-client';
import { PictureIcon } from '../../../../../public/icon';
import { useRef } from 'react';

export default function EditProfilePage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    const [nickname, setNickname] = useState('');
    const [profileImage, setProfileImage] = useState('');

    // 비밀번호 변경 관련 상태
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'profiles');

            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || '업로드 실패');
            setProfileImage(data.url);
        } catch (err: any) {
            setError(err.message || '이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (!isPending && !session) {
            router.push('/login');
            return;
        }

        if (session?.user) {
            setNickname(session.user.nickname || session.user.name || '');
            setProfileImage(session.user.image || '');
        }
    }, [session, isPending, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await authClient.updateUser({
                image: profileImage,
                // @ts-ignore - nickname is an additional field
                nickname: nickname,
            });

            if (error) throw error;

            alert('프로필 정보가 수정되었습니다. ✨');
            router.push('/mypage');
            router.refresh();
        } catch (err: any) {
            setError(err.message || '정보 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await authClient.changePassword({
                newPassword: newPassword,
                currentPassword: currentPassword,
                revokeOtherSessions: true,
            });

            if (error) throw error;

            alert('비밀번호가 안전하게 변경되었습니다. 🔒');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.message || '비밀번호 변경 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (isPending) return null;
    if (!session) return null;

    return (
        <main className="min-h-screen bg-white pb-24">
            <div className="mx-auto max-w-[800px] px-8 py-16">
                <header className="mb-12">
                    <button
                        onClick={() => router.back()}
                        className="text-[#888888] hover:text-[#00B461] mb-4 flex items-center gap-1 transition-colors font-semibold"
                    >
                        <span>‹</span> 뒤로가기
                    </button>
                    <h1 className="text-[32px] font-black text-[#333333] tracking-tighter">정보 수정</h1>
                    <p className="text-[#999999] mt-2">회원님의 소중한 정보를 안전하게 관리하세요.</p>
                </header>

                <div className="space-y-16">
                    {/* 1. 기본 정보 수정 섹션 */}
                    <section className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-sm">
                        <h2 className="text-[20px] font-bold text-[#333333] mb-8 flex items-center gap-2">
                            기본 정보 📋
                        </h2>

                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            {/* 프로필 이미지 업로드 */}
                            <div className="flex flex-col items-start gap-4">
                                <label className="text-sm font-bold text-[#666666] ml-1">프로필 이미지</label>
                                <div className="flex items-center gap-8 w-full p-4 rounded-2xl bg-gray-50/50">
                                    <div
                                        className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center bg-white cursor-pointer hover:border-[#00B461] transition-all"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {uploading ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-5 h-5 border-2 border-[#00B461] border-t-transparent rounded-full animate-spin" />
                                                <span className="text-[10px] text-[#00B461] font-bold">UP</span>
                                            </div>
                                        ) : (
                                            <>
                                                {profileImage ? (
                                                    <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                                                        <PictureIcon />
                                                    </div>
                                                )}
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
                                    <div className="text-xs text-[#999999] leading-relaxed">
                                        <p>• 1:1 비율의 이미지를 권장합니다.</p>
                                        <p>• JPG, PNG, WEBP 형식을 지원합니다.</p>
                                    </div>
                                </div>
                            </div>

                            {/* 닉네임 입력 */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="nickname" className="text-sm font-bold text-[#666666] ml-1">닉네임</label>
                                <input
                                    id="nickname"
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-[16px] transition-all focus:border-[#00B461] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#00B461]/5"
                                    placeholder="변경할 닉네임을 입력하세요"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-[20px] bg-[#00B461] px-6 py-4 text-[17px] font-black text-white shadow-lg shadow-[#00B461]/20 transition-all hover:bg-[#009E54] active:scale-[0.98] disabled:bg-gray-300"
                            >
                                {loading ? '수정 중...' : '기본 정보 저장하기'}
                            </button>
                        </form>
                    </section>

                    {/* 2. 비밀번호 변경 섹션 (요청하신 통합 배치) */}
                    <section className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-sm">
                        <h2 className="text-[20px] font-bold text-[#333333] mb-8 flex items-center gap-2">
                            비밀번호 변경 🔒
                        </h2>

                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-[#666666] ml-1">현재 비밀번호</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-[16px] transition-all focus:border-[#00B461] focus:bg-white focus:outline-none"
                                    placeholder="현재 사용 중인 비밀번호"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-[#666666] ml-1">새 비밀번호</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-[16px] transition-all focus:border-[#00B461] focus:bg-white focus:outline-none"
                                        placeholder="새 비밀번호"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-[#666666] ml-1">새 비밀번호 확인</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-4 text-[16px] transition-all focus:border-[#00B461] focus:bg-white focus:outline-none"
                                        placeholder="비밀번호 재입력"
                                        required
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm ml-1">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 rounded-[20px] bg-[#333333] px-6 py-4 text-[17px] font-black text-white transition-all hover:bg-[#222222] active:scale-[0.98] disabled:bg-gray-300"
                            >
                                {loading ? '처리 중...' : '비밀번호 변경하기'}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}
