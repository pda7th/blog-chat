'use client';

import type { CommentDto } from './comment.dto';
import { CommentForm } from './CommentForm';
import { useState } from 'react';

interface Props {
  reply: CommentDto;
  postId: number;
  rootCommentId: number;
  currentUserId?: string;
  onReplyAdded: (newReply: CommentDto) => void;
  onDeleted: (commentId: number) => void;
}

export function ReplyItem({ reply, postId, rootCommentId, currentUserId, onReplyAdded, onDeleted }: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // @ prefix 표시 여부: replyToCommentId !== parentId(root)인 경우에만
  const showAtPrefix =
    reply.replyToCommentId != null &&
    reply.replyToCommentId !== reply.parentId &&
    reply.replyTo?.nickname != null;

  const isDeleted = reply.status === 'DELETED';
  const isOwner = currentUserId === reply.userId;

  async function handleDelete() {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/comments/${reply.commentId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      onDeleted(reply.commentId);
    } else {
      setError(json.error?.message ?? '삭제 실패');
    }
  }

  return (
    <div className="ml-8 border-l-2 border-gray-100 pl-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <span className="mr-1 text-xs font-semibold text-gray-700">{reply.author.nickname ?? '익명'}</span>
          {showAtPrefix && (
            <span className="mr-1 text-xs font-semibold text-blue-500">@{reply.replyTo!.nickname}</span>
          )}
          <span className={`text-sm ${isDeleted ? 'italic text-gray-400' : 'text-gray-800'}`}>
            {reply.content}
          </span>
        </div>
        {isOwner && !isDeleted && (
          <div className="flex shrink-0 gap-1">
            <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-600">삭제</button>
          </div>
        )}
      </div>
      <div className="mt-1 flex gap-3">
        <span className="text-[11px] text-gray-400">{new Date(reply.createdAt).toLocaleString('ko-KR')}</span>
        {!isDeleted && (
          <button
            onClick={() => setShowReplyForm((v) => !v)}
            className="text-[11px] text-gray-400 hover:text-blue-500"
          >
            답글 달기
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {showReplyForm && (
        <div className="mt-2">
          <CommentForm
            postId={postId}
            replyTarget={{
              parentId: rootCommentId,
              replyToCommentId: reply.commentId,
              nickname: reply.author.nickname,
            }}
            onSuccess={(c) => {
              onReplyAdded(c);
              setShowReplyForm(false);
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  );
}
