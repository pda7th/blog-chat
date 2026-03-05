import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { CommentSection } from '@/features/comments/CommentSection';

interface Props {
  params: Promise<{ postId: string }>;
}

export default async function DevCommentsPage({ params }: Props) {
  const { postId: postIdStr } = await params;
  const postId = Number(postIdStr);

  const session = await auth.api.getSession({ headers: await headers() });
  const currentUserId = session?.user.id ?? undefined;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-2 text-sm text-yellow-700">
        🛠 개발용 댓글 테스트 페이지 — postId: <strong>{postId}</strong>
        {currentUserId ? (
          <span className="ml-2 text-green-600">(로그인됨: {session?.user.nickname ?? session?.user.email})</span>
        ) : (
          <span className="ml-2 text-gray-500">(비로그인 — 읽기만 가능)</span>
        )}
      </div>
      <CommentSection postId={postId} currentUserId={currentUserId} />
    </main>
  );
}
