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
            <div className="mb-8 flex items-center gap-2">
                <div className="h-5 w-1.5 rounded-full bg-[#00C471]" />
                <h2 className="text-[20px] font-bold text-[#333333] tracking-tight">내가 심은 지식</h2>
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray-400">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
                        <span>불러오는 중...</span>
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.postId}
                            onClick={() => router.push(`/home/${post.postId}`)}
                            className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-green-100 hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-300" />
                                <span className="text-[16px] font-semibold text-[#444444]">{post.title}</span>
                            </div>
                            <span className="shrink-0 text-sm font-medium text-[#CCCCCC]">
                                {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-[#CCCCCC]">
                        <span className="mb-4 text-4xl">🌱</span>
                        <p className="font-medium">아직 작성한 포스트가 없습니다.</p>
                        <p className="mt-1 text-sm">첫 번째 지식의 씨앗을 심어보세요!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
