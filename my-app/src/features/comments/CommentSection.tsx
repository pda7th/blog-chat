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
    <section className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-gray-800">댓글</h2>

      {currentUserId ? (
        <CommentForm postId={postId} onSuccess={handleCommentAdded} />
      ) : (
        <p className="text-sm text-gray-400">댓글을 작성하려면 로그인이 필요합니다.</p>
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
        {loading && <p className="text-sm text-gray-400">로딩 중...</p>}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-gray-400">첫 번째 댓글을 작성해보세요.</p>
        )}
        {hasNext && !loading && (
          <button
            onClick={() => loadComments(nextCursor)}
            className="self-center text-sm text-blue-500 hover:underline"
          >
            댓글 더 보기
          </button>
        )}
      </div>
    </section>
  );
}
