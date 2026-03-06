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
    <div className={`rounded-2xl border bg-white p-4 shadow-sm transition-all duration-150 ${isDeleted ? 'border-gray-50 bg-gray-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-1 gap-2.5">
          {comment.author.image ? (
            <img src={comment.author.image} alt={comment.author.nickname ?? '프로필'} className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-gray-100" />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
              {(comment.author.nickname ?? '익')[0]}
            </div>
          )}
          <div className="flex-1">
            <span className="mr-2 text-sm font-bold text-gray-800">{comment.author.nickname ?? '익명'}</span>
            <span className={`text-sm leading-relaxed ${isDeleted ? 'italic text-gray-400' : 'text-gray-700'}`}>
              {comment.content}
            </span>
          </div>
        </div>
        {isOwner && !isDeleted && (
          <button onClick={handleDelete} className="shrink-0 rounded-md px-2 py-1 text-xs text-gray-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-400">
            삭제
          </button>
        )}
      </div>
      <div className="mt-2 pl-43pxr">
        <span className="text-[11px] text-gray-400">{new Date(comment.createdAt).toLocaleString('ko-KR')}</span>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <RepliesList rootComment={comment} postId={postId} currentUserId={currentUserId} />
    </div>
  );
}
