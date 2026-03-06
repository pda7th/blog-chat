'use client';

import { useEffect, useState } from 'react';
import type { CommentDto } from './comment.dto';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface Props {
  postId: number;
  currentUserId?: string;
}

export function CommentSection({ postId, currentUserId }: Props) {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadComments(cursor: string | null = null) {
    setLoading(true);
    const url = new URL(`/api/posts/${postId}/comments`, window.location.origin);
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url.toString());
    const json = await res.json();
    if (json.success) {
      setComments((prev) => (cursor ? [...prev, ...json.data.items] : json.data.items));
      setNextCursor(json.data.pagination.nextCursor);
      setHasNext(json.data.pagination.hasNext);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadComments(null);
  }, [postId]);

  function handleCommentAdded(newComment: CommentDto) {
    setComments((prev) => [newComment, ...prev]);
  }

  function handleDeleted(commentId: number) {
    setComments((prev) =>
      prev.map((c) =>
        c.commentId === commentId ? { ...c, status: 'DELETED' as const, content: '삭제된 댓글입니다.' } : c,
      ),
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-8pxr">
        <div className="h-4 w-1 rounded-full bg-[#00C471]" />
        <h2 className="text-base font-bold text-gray-800">댓글</h2>
      </div>

      {currentUserId ? (
        <CommentForm postId={postId} onSuccess={handleCommentAdded} />
      ) : (
        <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-400">댓글을 작성하려면 로그인이 필요합니다.</p>
      )}

      <div className="flex flex-col gap-3">
        {comments.map((c) => (
          <CommentItem
            key={c.commentId}
            comment={c}
            postId={postId}
            currentUserId={currentUserId}
            onDeleted={handleDeleted}
          />
        ))}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
            <span>로딩 중...</span>
          </div>
        )}
        {!loading && comments.length === 0 && (
          <p className="rounded-xl bg-gray-50 py-8 text-center text-sm text-gray-400">첫 번째 댓글을 작성해보세요.</p>
        )}
        {hasNext && !loading && (
          <button
            onClick={() => loadComments(nextCursor)}
            className="self-center rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-600 transition-all duration-150 hover:bg-green-100"
          >
            댓글 더 보기
          </button>
        )}
      </div>
    </section>
  );
}
