import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createComment, listRootComments, ServiceError } from '@/features/comments/comment.service';
import type { ApiEnvelope, ApiCursorPaginationEnvelope } from '@/types/api-envelopes';
import type { CommentDto } from '@/features/comments/comment.dto';

type Params = { params: Promise<{ postId: string }> };

export async function GET(
  req: NextRequest,
  { params }: Params,
): Promise<NextResponse<ApiCursorPaginationEnvelope<CommentDto>>> {
  const { postId: postIdStr } = await params;
  const postId = Number(postIdStr);
  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ success: false, error: { message: '유효하지 않은 postId입니다.' } }, { status: 400 });
  }

  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get('cursor') ?? null;
  const limit = Math.min(Number(searchParams.get('limit') ?? '10'), 50);

  try {
    const result = await listRootComments(postId, cursor, limit);
    return NextResponse.json({
      success: true,
      data: { items: result.items, pagination: { limit, nextCursor: result.nextCursor, hasNext: result.hasNext } },
    });
  } catch (e) {
    if (e instanceof ServiceError) {
      return NextResponse.json({ success: false, error: { message: e.message } }, { status: e.status });
    }
    console.error(e);
    return NextResponse.json({ success: false, error: { message: '서버 오류가 발생했습니다.' } }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params): Promise<NextResponse<ApiEnvelope<CommentDto>>> {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ success: false, error: { message: '로그인이 필요합니다.' } }, { status: 401 });
  }

  const { postId: postIdStr } = await params;
  const postId = Number(postIdStr);
  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ success: false, error: { message: '유효하지 않은 postId입니다.' } }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.content !== 'string' || body.content.trim() === '') {
    return NextResponse.json({ success: false, error: { message: 'content는 필수입니다.' } }, { status: 400 });
  }

  const {
    content,
    parentId = null,
    replyToCommentId = null,
  } = body as {
    content: string;
    parentId?: number | null;
    replyToCommentId?: number | null;
  };

  try {
    const comment = await createComment(session.user.id, postId, content.trim(), parentId, replyToCommentId);
    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (e) {
    if (e instanceof ServiceError) {
      return NextResponse.json({ success: false, error: { message: e.message } }, { status: e.status });
    }
    console.error(e);
    return NextResponse.json({ success: false, error: { message: '서버 오류가 발생했습니다.' } }, { status: 500 });
  }
}
