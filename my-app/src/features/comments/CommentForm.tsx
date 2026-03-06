'use client';

import { useState } from 'react';
import type { CommentDto } from './comment.dto';

interface ReplyTarget {
  parentId: number;       // 루트 commentId (thread root)
  replyToCommentId: number; // 실제 답글 대상 (같으면 일반 답글)
  nickname: string | null;
}

interface Props {
  postId: number;
  replyTarget?: ReplyTarget | null;
  onSuccess: (comment: CommentDto) => void;
  onCancel?: () => void;
}

export function CommentForm({ postId, replyTarget, onSuccess, onCancel }: Props) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeholder = replyTarget
    ? replyTarget.replyToCommentId !== replyTarget.parentId && replyTarget.nickname
      ? `@${replyTarget.nickname}에게 답글 작성...`
      : '답글 작성...'
    : '댓글 작성...';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          parentId: replyTarget?.parentId ?? null,
          replyToCommentId: replyTarget?.replyToCommentId ?? null,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message ?? '작성 실패');
        return;
      }

      setContent('');
      onSuccess(json.data);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
      <textarea
        className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm transition-all duration-150 focus:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400/20"
        rows={2}
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors duration-150 hover:bg-gray-100">
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="rounded-lg bg-[#00C471] px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all duration-150 hover:bg-green-600 active:scale-95 disabled:opacity-40"
        >
          {loading ? '작성 중...' : '작성'}
        </button>
      </div>
    </form>
  );
}
