'use client';

import { useState } from 'react';
import type { CommentDto } from './comment.dto';
import { ReplyItem } from './ReplyItem';
import { CommentForm } from './CommentForm';

interface Props {
  rootComment: CommentDto;
  postId: number;
  currentUserId?: string;
}

export function RepliesList({ rootComment, postId, currentUserId }: Props) {
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState<CommentDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  async function loadReplies(cursor: string | null = null) {
    setLoading(true);
    const url = new URL(`/api/comments/${rootComment.commentId}/replies`, window.location.origin);
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url.toString());
    const json = await res.json();
    if (json.success) {
      setReplies((prev) => (cursor ? [...prev, ...json.data.items] : json.data.items));
      setNextCursor(json.data.pagination.nextCursor);
      setHasNext(json.data.pagination.hasNext);
    }
    setLoading(false);
  }

  function handleToggle() {
    if (!open) {
      loadReplies(null);
    }
    setOpen((v) => !v);
  }

  function handleReplyAdded(newReply: CommentDto) {
    setReplies((prev) => [...prev, newReply]);
    setOpen(true);
  }

  function handleDeleted(commentId: number) {
    setReplies((prev) =>
      prev.map((r) => (r.commentId === commentId ? { ...r, status: 'DELETED' as const, content: '삭제된 댓글입니다.' } : r)),
    );
  }

  return (
    <div className="mt-1">
      <div className="flex gap-3">
        <button onClick={handleToggle} className="text-[11px] font-medium text-blue-500 hover:underline">
          {open ? '답글 숨기기' : '답글 보기'}
        </button>
        <button onClick={() => setShowReplyForm((v) => !v)} className="text-[11px] text-gray-400 hover:text-blue-500">
          답글 달기
        </button>
      </div>

      {showReplyForm && (
        <div className="mt-2 ml-8">
          <CommentForm
            postId={postId}
            replyTarget={{
              parentId: rootComment.commentId,
              replyToCommentId: rootComment.commentId,
              nickname: null,
            }}
            onSuccess={(c) => {
              handleReplyAdded(c);
              setShowReplyForm(false);
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {open && (
        <div className="mt-2 flex flex-col gap-3">
          {replies.map((reply) => (
            <ReplyItem
              key={reply.commentId}
              reply={reply}
              postId={postId}
              rootCommentId={rootComment.commentId}
              currentUserId={currentUserId}
              onReplyAdded={handleReplyAdded}
              onDeleted={handleDeleted}
            />
          ))}
          {loading && <p className="text-xs text-gray-400">로딩 중...</p>}
          {hasNext && !loading && (
            <button
              onClick={() => loadReplies(nextCursor)}
              className="ml-8 text-xs text-blue-400 hover:underline"
            >
              답글 더 보기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
