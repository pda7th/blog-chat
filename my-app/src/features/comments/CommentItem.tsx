'use client';

import { useState } from 'react';
import type { CommentDto } from './comment.dto';
import { RepliesList } from './RepliesList';

interface Props {
  comment: CommentDto;
  postId: number;
  currentUserId?: string;
  onDeleted: (commentId: number) => void;
}

export function CommentItem({ comment, postId, currentUserId, onDeleted }: Props) {
  const [error, setError] = useState<string | null>(null);

  const isDeleted = comment.status === 'DELETED';
  const isOwner = currentUserId === comment.userId;

  async function handleDelete() {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    const res = await fetch(`/api/comments/${comment.commentId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      onDeleted(comment.commentId);
    } else {
      setError(json.error?.message ?? '삭제 실패');
    }
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <span className="mr-2 text-sm font-semibold text-gray-800">{comment.author.nickname ?? '익명'}</span>
          <span className={`text-sm ${isDeleted ? 'italic text-gray-400' : 'text-gray-700'}`}>
            {comment.content}
          </span>
        </div>
        {isOwner && !isDeleted && (
          <button onClick={handleDelete} className="shrink-0 text-xs text-red-400 hover:text-red-600">
            삭제
          </button>
        )}
      </div>
      <div className="mt-1">
        <span className="text-[11px] text-gray-400">{new Date(comment.createdAt).toLocaleString('ko-KR')}</span>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <RepliesList rootComment={comment} postId={postId} currentUserId={currentUserId} />
    </div>
  );
}
