import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { post, postLikes, comment } from '@/db/schema/post';
import { user } from '@/db/schema/auth';
import { eq, and, count } from 'drizzle-orm';
import type { ApiEnvelope } from '@/types/api-envelopes';

type Params = { params: Promise<{ postId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { postId } = await params;
    const id = Number(postId);
    if (!id) {
      return NextResponse.json({ success: false, error: { message: '잘못된 postId' } } satisfies ApiEnvelope<never>, {
        status: 400,
      });
    }

    const [found] = await db
      .select({
        postId: post.postId,
        title: post.title,
        content: post.content,
        category: post.category,
        image1: post.image1,
        image2: post.image2,
        image3: post.image3,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        userId: post.userId,
        authorName: user.name,
        authorNickname: user.nickname,
        authorProfileImage: user.userProfileImageUrl,
      })
      .from(post)
      .innerJoin(user, eq(post.userId, user.id))
      .where(and(eq(post.postId, id), eq(post.status, 'ACTIVE')));

    if (!found) {
      return NextResponse.json(
        { success: false, error: { message: '게시글을 찾을 수 없습니다.' } } satisfies ApiEnvelope<never>,
        { status: 404 },
      );
    }

    const [[{ likeCount }], [{ commentCount }]] = await Promise.all([
      db
        .select({ likeCount: count() })
        .from(postLikes)
        .where(and(eq(postLikes.postId, id), eq(postLikes.status, 'ACTIVE'))),
      db
        .select({ commentCount: count() })
        .from(comment)
        .where(and(eq(comment.postId, id), eq(comment.status, 'ACTIVE'))),
    ]);

    return NextResponse.json({
      success: true,
      data: { ...found, likeCount, commentCount },
    } satisfies ApiEnvelope<typeof found & { likeCount: number; commentCount: number }>);
  } catch (err) {
    console.error('[GET /api/posts/[postId]]', err);
    return NextResponse.json({ success: false, error: { message: '게시글 조회 실패' } } satisfies ApiEnvelope<never>, {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    // const session = await auth.api.getSession({ headers: await headers() });
    // if (!session) return NextResponse.json(
    //   { success: false, error: { message: '로그인이 필요합니다.' } } satisfies ApiEnvelope<never>,
    //   { status: 401 },
    // );

    const { postId } = await params;
    const id = Number(postId);
    if (!id) {
      return NextResponse.json({ success: false, error: { message: '잘못된 postId' } } satisfies ApiEnvelope<never>, {
        status: 400,
      });
    }

    const [existing] = await db
      .select({ userId: post.userId })
      .from(post)
      .where(and(eq(post.postId, id), eq(post.status, 'ACTIVE')));

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: '게시글을 찾을 수 없습니다.' } } satisfies ApiEnvelope<never>,
        { status: 404 },
      );
    }

    // if (existing.userId !== session.user.id) {
    //   return NextResponse.json(
    //     { success: false, error: { message: '수정 권한이 없습니다.' } } satisfies ApiEnvelope<never>,
    //     { status: 403 },
    //   );
    // }

    const body = await req.json();
    const { title, content, category, image1, image2, image3 } = body;

    if (!title?.trim() || !content?.trim() || !category?.trim()) {
      return NextResponse.json(
        { success: false, error: { message: '제목, 내용, 카테고리는 필수입니다.' } } satisfies ApiEnvelope<never>,
        { status: 400 },
      );
    }

    await db
      .update(post)
      .set({
        title: title.trim(),
        content: content.trim(),
        category,
        image1: image1 ?? null,
        image2: image2 ?? null,
        image3: image3 ?? null,
      })
      .where(eq(post.postId, id));

    return NextResponse.json({ success: true, data: { postId: id } } satisfies ApiEnvelope<{ postId: number }>);
  } catch (err) {
    console.error('[PATCH /api/posts/[postId]]', err);
    return NextResponse.json({ success: false, error: { message: '게시글 수정 실패' } } satisfies ApiEnvelope<never>, {
      status: 500,
    });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    // const session = await auth.api.getSession({ headers: await headers() });
    // if (!session) return NextResponse.json(
    //   { success: false, error: { message: '로그인이 필요합니다.' } } satisfies ApiEnvelope<never>,
    //   { status: 401 },
    // );

    const { postId } = await params;
    const id = Number(postId);
    if (!id) {
      return NextResponse.json({ success: false, error: { message: '잘못된 postId' } } satisfies ApiEnvelope<never>, {
        status: 400,
      });
    }

    const [existing] = await db
      .select({ userId: post.userId })
      .from(post)
      .where(and(eq(post.postId, id), eq(post.status, 'ACTIVE')));

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { message: '게시글을 찾을 수 없습니다.' } } satisfies ApiEnvelope<never>,
        { status: 404 },
      );
    }

    // if (existing.userId !== session.user.id) {
    //   return NextResponse.json(
    //     { success: false, error: { message: '삭제 권한이 없습니다.' } } satisfies ApiEnvelope<never>,
    //     { status: 403 },
    //   );
    // }

    await db.update(post).set({ status: 'DELETED' }).where(eq(post.postId, id));

    return NextResponse.json({ success: true, data: { message: '삭제되었습니다.' } } satisfies ApiEnvelope<{
      message: string;
    }>);
  } catch (err) {
    console.error('[DELETE /api/posts/[postId]]', err);
    return NextResponse.json({ success: false, error: { message: '게시글 삭제 실패' } } satisfies ApiEnvelope<never>, {
      status: 500,
    });
  }
}
