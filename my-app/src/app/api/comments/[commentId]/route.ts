import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { editComment, removeComment, ServiceError } from '@/features/comments/comment.service';
import type { ApiEnvelope } from '@/types/api-envelops';

type Params = { params: Promise<{ commentId: string }> };

export async function PATCH(req: NextRequest, { params }: Params): Promise<NextResponse<ApiEnvelope<{ ok: true }>>> {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ success: false, error: { message: '로그인이 필요합니다.' } }, { status: 401 });
  }

  const { commentId: commentIdStr } = await params;
  const commentId = Number(commentIdStr);
  if (!Number.isInteger(commentId) || commentId <= 0) {
    return NextResponse.json({ success: false, error: { message: '유효하지 않은 commentId입니다.' } }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.content !== 'string' || body.content.trim() === '') {
    return NextResponse.json({ success: false, error: { message: 'content는 필수입니다.' } }, { status: 400 });
  }

  try {
    await editComment(session.user.id, commentId, body.content.trim());
    return NextResponse.json({ success: true, data: { ok: true } });
  } catch (e) {
    if (e instanceof ServiceError) {
      return NextResponse.json({ success: false, error: { message: e.message } }, { status: e.status });
    }
    console.error(e);
    return NextResponse.json({ success: false, error: { message: '서버 오류가 발생했습니다.' } }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params): Promise<NextResponse<ApiEnvelope<{ ok: true }>>> {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ success: false, error: { message: '로그인이 필요합니다.' } }, { status: 401 });
  }

  const { commentId: commentIdStr } = await params;
  const commentId = Number(commentIdStr);
  if (!Number.isInteger(commentId) || commentId <= 0) {
    return NextResponse.json({ success: false, error: { message: '유효하지 않은 commentId입니다.' } }, { status: 400 });
  }

  try {
    await removeComment(session.user.id, commentId);
    return NextResponse.json({ success: true, data: { ok: true } });
  } catch (e) {
    if (e instanceof ServiceError) {
      return NextResponse.json({ success: false, error: { message: e.message } }, { status: e.status });
    }
    console.error(e);
    return NextResponse.json({ success: false, error: { message: '서버 오류가 발생했습니다.' } }, { status: 500 });
  }
}
