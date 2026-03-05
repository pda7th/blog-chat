import { useSession } from '@/lib/auth-client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PostSummary } from '@/lib/post';
import type { ApiPaginationEnvelope } from '@/types/api-envelopes';

export default function MyPostList() {
    const { data: session } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.id) return;

        setLoading(true);
        fetch('/api/user/my-posts')
            .then((res) => res.json())
            .then((json: ApiPaginationEnvelope<PostSummary>) => {
                if (json.success) {
                    setPosts(json.data.items);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [session]);

    return (
        <div className="flex-1">
            <div className="inline-block border-b-2 border-[#00B461] mb-10 pb-1">
                <h2 className="text-[20px] font-bold text-[#333333] tracking-tight">내가 심은 지식</h2>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">불러오는 중...</div>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.postId}
                            onClick={() => router.push(`/home/${post.postId}`)}
                            className="w-full bg-white border border-[#F0F0F0] rounded-[16px] p-6 flex justify-between items-center hover:shadow-sm transition-all cursor-pointer"
                        >
                            <span className="text-[#444444] font-semibold text-[17px]">{post.title}</span>
                            <span className="text-[#CCCCCC] text-sm font-medium">
                                {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-[#CCCCCC]">
                        <span className="text-4xl mb-4">🌱</span>
                        <p>아직 작성한 포스트가 없습니다.</p>
                        <p className="text-sm">첫 번째 지식의 씨앗을 심어보세요!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
