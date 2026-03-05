import { and, asc, desc, eq, isNull, lt, or } from 'drizzle-orm';
import { db } from '@/db';
import { comment, user } from '@/db/schema';
import { encodeCursor } from './comment.cursor';
import type { CommentDto } from './comment.dto';

const DELETED_CONTENT = '삭제된 댓글입니다.';

// ── row → DTO ────────────────────────────────────────────────────────────────
function toDto(
  row: typeof comment.$inferSelect,
  author: { id: string; nickname: string | null },
  replyToAuthor?: { id: string; nickname: string | null } | null,
): CommentDto {
  return {
    commentId: row.commentId,
    postId: row.postId,
    userId: row.userId,
    parentId: row.parentId ?? null,
    replyToCommentId: row.replyToCommentId ?? null,
    content: row.content,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    author: { userId: author.id, nickname: author.nickname ?? null },
    replyTo: replyToAuthor
      ? { commentId: row.replyToCommentId!, userId: replyToAuthor.id, nickname: replyToAuthor.nickname ?? null }
      : null,
  };
}

// ── 단건 조회 ──────────────────────────────────────────────────────────────────
export async function findCommentById(commentId: number) {
  const rows = await db
    .select()
    .from(comment)
    .where(eq(comment.commentId, commentId))
    .limit(1);
  return rows[0] ?? null;
}

// ── 루트 댓글 목록 (커서 페이징) ──────────────────────────────────────────────
export async function findRootComments(
  postId: number,
  cursor: { createdAt: Date; commentId: number } | null,
  limit: number,
): Promise<{ items: CommentDto[]; nextCursor: string | null; hasNext: boolean }> {
  const authorAlias = user;

  const baseWhere = and(eq(comment.postId, postId), isNull(comment.parentId));
  const cursorWhere = cursor
    ? or(
        lt(comment.createdAt, cursor.createdAt),
        and(eq(comment.createdAt, cursor.createdAt), lt(comment.commentId, cursor.commentId)),
      )
    : undefined;

  const rows = await db
    .select({
      comment,
      author: { id: authorAlias.id, nickname: authorAlias.nickname },
    })
    .from(comment)
    .innerJoin(authorAlias, eq(comment.userId, authorAlias.id))
    .where(cursorWhere ? and(baseWhere, cursorWhere) : baseWhere)
    .orderBy(desc(comment.createdAt), desc(comment.commentId))
    .limit(limit + 1);

  const hasNext = rows.length > limit;
  const items = rows.slice(0, limit).map((r) => toDto(r.comment, r.author));
  const last = items[items.length - 1];
  const nextCursor = hasNext && last ? encodeCursor(last.createdAt, last.commentId) : null;

  return { items, nextCursor, hasNext };
}

// ── 답글 목록 (커서 페이징, replyTo 포함) ─────────────────────────────────────
export async function findReplies(
  parentCommentId: number,
  cursor: { createdAt: Date; commentId: number } | null,
  limit: number,
): Promise<{ items: CommentDto[]; nextCursor: string | null; hasNext: boolean }> {
  const authorUser = user;
  const replyToUser = db.$with('reply_to_user').as(db.select().from(user));

  const baseWhere = eq(comment.parentId, parentCommentId);
  const cursorWhere = cursor
    ? or(
        lt(comment.createdAt, cursor.createdAt),
        and(eq(comment.createdAt, cursor.createdAt), lt(comment.commentId, cursor.commentId)),
      )
    : undefined;

  // replyToComment join을 위한 self-join
  const replyToComment = db.$with('reply_to_comment').as(db.select().from(comment));

  const rows = await db
    .select({
      comment,
      author: { id: authorUser.id, nickname: authorUser.nickname },
    })
    .from(comment)
    .innerJoin(authorUser, eq(comment.userId, authorUser.id))
    .where(cursorWhere ? and(baseWhere, cursorWhere) : baseWhere)
    .orderBy(asc(comment.createdAt), asc(comment.commentId))
    .limit(limit + 1);

  const hasNext = rows.length > limit;
  const sliced = rows.slice(0, limit);

  // replyToCommentId가 있는 경우 author 정보 별도 조회
  const replyToIds = [...new Set(sliced.map((r) => r.comment.replyToCommentId).filter((id): id is number => id != null))];

  let replyToMap = new Map<number, { commentId: number; userId: string; nickname: string | null }>();

  if (replyToIds.length > 0) {
    // replyToCommentId → userId → nickname 조회
    const replyToRows = await db
      .select({ commentId: comment.commentId, userId: comment.userId, nickname: user.nickname })
      .from(comment)
      .innerJoin(user, eq(comment.userId, user.id))
      .where(
        replyToIds.length === 1
          ? eq(comment.commentId, replyToIds[0])
          : or(...replyToIds.map((id) => eq(comment.commentId, id))),
      );

    for (const r of replyToRows) {
      replyToMap.set(r.commentId, { commentId: r.commentId, userId: r.userId, nickname: r.nickname ?? null });
    }
  }

  const items = sliced.map((r) => {
    const replyToInfo = r.comment.replyToCommentId != null ? replyToMap.get(r.comment.replyToCommentId) : null;
    return toDto(
      r.comment,
      r.author,
      replyToInfo ? { id: replyToInfo.userId, nickname: replyToInfo.nickname } : null,
    );
  });

  const last = items[items.length - 1];
  const nextCursor = hasNext && last ? encodeCursor(last.createdAt, last.commentId) : null;

  return { items, nextCursor, hasNext };
}

// ── 댓글 작성 ─────────────────────────────────────────────────────────────────
export async function insertComment(data: {
  userId: string;
  postId: number;
  parentId: number | null;
  replyToCommentId: number | null;
  content: string;
}): Promise<CommentDto> {
  const [result] = await db.insert(comment).values({
    userId: data.userId,
    postId: data.postId,
    parentId: data.parentId ?? undefined,
    replyToCommentId: data.replyToCommentId ?? undefined,
    content: data.content,
  });

  const inserted = await findCommentById(result.insertId);
  if (!inserted) throw new Error('insert 후 댓글 조회 실패');

  const authorRow = await db.select({ id: user.id, nickname: user.nickname }).from(user).where(eq(user.id, data.userId)).limit(1);
  const author = authorRow[0] ?? { id: data.userId, nickname: null };

  return toDto(inserted, author);
}

// ── 댓글 수정 ─────────────────────────────────────────────────────────────────
export async function updateComment(commentId: number, content: string): Promise<void> {
  await db.update(comment).set({ content }).where(eq(comment.commentId, commentId));
}

// ── 댓글 soft delete ──────────────────────────────────────────────────────────
export async function softDeleteComment(commentId: number): Promise<void> {
  await db.update(comment).set({ status: 'DELETED', content: DELETED_CONTENT }).where(eq(comment.commentId, commentId));
}
