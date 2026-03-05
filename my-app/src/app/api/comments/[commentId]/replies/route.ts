import { NextRequest, NextResponse } from 'next/server';
import { listReplies, ServiceError } from '@/features/comments/comment.service';
import type { ApiCursorPaginationEnvelope } from '@/types/api-envelops';
import type { CommentDto } from '@/features/comments/comment.dto';

type Params = { params: Promise<{ commentId: string }> };

export async function GET(req: NextRequest, { params }: Params): Promise<NextResponse<ApiCursorPaginationEnvelope<CommentDto>>> {
  const { commentId: commentIdStr } = await params;
  const commentId = Number(commentIdStr);
  if (!Number.isInteger(commentId) || commentId <= 0) {
    return NextResponse.json({ success: false, error: { message: '유효하지 않은 commentId입니다.' } }, { status: 400 });
  }

  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get('cursor') ?? null;
  const limit = Math.min(Number(searchParams.get('limit') ?? '10'), 50);

  try {
    const result = await listReplies(commentId, cursor, limit);
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
