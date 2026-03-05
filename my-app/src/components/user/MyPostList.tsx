'use client';

import { useSession } from '@/lib/auth-client';
import { useEffect, useState } from 'react';

interface Post {
    id: string;
    title: string;
    createdAt: string;
}

export default function MyPostList() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const dummyPosts: Post[] = [
            { id: '1', title: 'Better Auth와 Next.js 14 보안 전략', createdAt: '2026.03.03' },
        ];
        setPosts(dummyPosts);
    }, [session]);

    return (
        <div className="flex-1">
            <div className="inline-block border-b-2 border-[#00B461] mb-10 pb-1">
                <h2 className="text-[20px] font-bold text-[#333333] tracking-tight">내가 심은 지식</h2>
            </div>

            <div className="space-y-4">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="w-full bg-white border border-[#F0F0F0] rounded-[16px] p-6 flex justify-between items-center hover:shadow-sm transition-all cursor-pointer"
                    >
                        <span className="text-[#444444] font-semibold text-[17px]">{post.title}</span>
                        <span className="text-[#CCCCCC] text-sm font-medium">{post.createdAt}</span>
                    </div>
                ))}
                {posts.length === 0 && (
                    <div className="text-center py-20 text-[#CCCCCC]">아직 작성한 포스트가 없습니다.</div>
                )}
            </div>
        </div>
    );
}
