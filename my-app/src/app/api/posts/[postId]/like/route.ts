import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { postLikes } from '@/db/schema/post';
import { eq, and } from 'drizzle-orm';
import type { ApiEnvelope } from '@/types/api-envelopes';

type Params = { params: Promise<{ postId: string }> };

// POST /api/posts/[postId]/like — 좋아요 토글
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    // const session = await auth.api.getSession({ headers: await headers() });
    // if (!session) return NextResponse.json(
    //   { success: false, error: { message: '로그인이 필요합니다.' } } satisfies ApiEnvelope<never>,
    //   { status: 401 },
    // );

    const { postId } = await params;
    const id = Number(postId);
    const userId = 'test-user-id'; // 나중에 session.user.id 로 교체

    const [existing] = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, id), eq(postLikes.userId, userId)));

    if (existing) {
      // 이미 좋아요 → 취소 (DELETED 또는 ACTIVE 토글)
      const newStatus = existing.status === 'ACTIVE' ? 'DELETED' : 'ACTIVE';
      await db
        .update(postLikes)
        .set({ status: newStatus })
        .where(and(eq(postLikes.postId, id), eq(postLikes.userId, userId)));

      return NextResponse.json({
        success: true,
        data: { liked: newStatus === 'ACTIVE' },
      } satisfies ApiEnvelope<{ liked: boolean }>);
    } else {
      await db.insert(postLikes).values({ postId: id, userId });

      return NextResponse.json({
        success: true,
        data: { liked: true },
      } satisfies ApiEnvelope<{ liked: boolean }>);
    }
  } catch (err) {
    console.error('[POST /api/posts/[postId]/like]', err);
    return NextResponse.json({ success: false, error: { message: '좋아요 처리 실패' } } satisfies ApiEnvelope<never>, {
      status: 500,
    });
  }
}
