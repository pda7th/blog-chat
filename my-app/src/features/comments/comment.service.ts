import { decodeCursor } from './comment.cursor';
import type { CommentDto } from './comment.dto';
import * as repo from './comment.repository';

const DEFAULT_LIMIT = 10;

// ── 루트 댓글 목록 ─────────────────────────────────────────────────────────────
export async function listRootComments(
  postId: number,
  cursorStr: string | null,
  limit = DEFAULT_LIMIT,
) {
  const cursor = cursorStr ? decodeCursor(cursorStr) : null;
  return repo.findRootComments(postId, cursor, limit);
}

// ── 답글 목록 ──────────────────────────────────────────────────────────────────
export async function listReplies(
  parentCommentId: number,
  cursorStr: string | null,
  limit = DEFAULT_LIMIT,
) {
  const cursor = cursorStr ? decodeCursor(cursorStr) : null;
  return repo.findReplies(parentCommentId, cursor, limit);
}

// ── 댓글 작성 ─────────────────────────────────────────────────────────────────
export async function createComment(
  userId: string,
  postId: number,
  content: string,
  parentId: number | null | undefined,
  replyToCommentId: number | null | undefined,
): Promise<CommentDto> {
  // 루트 댓글
  if (!parentId) {
    return repo.insertComment({ userId, postId, parentId: null, replyToCommentId: null, content });
  }

  // 답글: parentId가 루트 댓글인지 검증
  const parent = await repo.findCommentById(parentId);
  if (!parent) throw new ServiceError(404, '부모 댓글을 찾을 수 없습니다.');
  if (parent.postId !== postId) throw new ServiceError(400, '부모 댓글이 해당 게시글에 속하지 않습니다.');
  if (parent.parentId != null) throw new ServiceError(400, '답글에는 답글을 달 수 없습니다. parentId는 루트 댓글이어야 합니다.');

  // replyToCommentId 검증
  let resolvedReplyToId: number = parentId; // 기본값 = 루트(parentId)
  if (replyToCommentId != null) {
    const replyTo = await repo.findCommentById(replyToCommentId);
    if (!replyTo) throw new ServiceError(404, 'replyTo 댓글을 찾을 수 없습니다.');
    if (replyTo.postId !== postId) throw new ServiceError(400, 'replyTo 댓글이 해당 게시글에 속하지 않습니다.');

    // replyTo의 루트(thread) 계산
    const replyToRootId = replyTo.parentId == null ? replyTo.commentId : replyTo.parentId;
    if (replyToRootId !== parentId) throw new ServiceError(400, 'replyTo 댓글이 같은 스레드에 속하지 않습니다.');

    resolvedReplyToId = replyToCommentId;
  }

  return repo.insertComment({ userId, postId, parentId, replyToCommentId: resolvedReplyToId, content });
}

// ── 댓글 수정 ─────────────────────────────────────────────────────────────────
export async function editComment(userId: string, commentId: number, content: string): Promise<void> {
  const target = await repo.findCommentById(commentId);
  if (!target) throw new ServiceError(404, '댓글을 찾을 수 없습니다.');
  if (target.userId !== userId) throw new ServiceError(403, '작성자만 수정할 수 있습니다.');
  if (target.status === 'DELETED') throw new ServiceError(400, '삭제된 댓글은 수정할 수 없습니다.');

  await repo.updateComment(commentId, content);
}

// ── 댓글 삭제 ─────────────────────────────────────────────────────────────────
export async function removeComment(userId: string, commentId: number): Promise<void> {
  const target = await repo.findCommentById(commentId);
  if (!target) throw new ServiceError(404, '댓글을 찾을 수 없습니다.');
  if (target.userId !== userId) throw new ServiceError(403, '작성자만 삭제할 수 있습니다.');
  if (target.status === 'DELETED') throw new ServiceError(400, '이미 삭제된 댓글입니다.');

  await repo.softDeleteComment(commentId);
}

// ── 공통 에러 클래스 ───────────────────────────────────────────────────────────
export class ServiceError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
