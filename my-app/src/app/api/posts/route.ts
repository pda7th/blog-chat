import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { post, postLikes, comment } from '@/db/schema/post';
import { eq, desc, and, count, inArray } from 'drizzle-orm';
import type { ApiEnvelope, ApiPaginationEnvelope } from '@/types/api-envelopes';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') ?? '10')));
    const offset = (page - 1) * pageSize;

    const where =
      category && category !== '전체'
        ? and(eq(post.status, 'ACTIVE'), eq(post.category, category))
        : eq(post.status, 'ACTIVE');

    const session = await auth.api.getSession({ headers: await headers() });
    const currentUserId = session?.user?.id ?? null;

    const [posts, [{ total }]] = await Promise.all([
      db
        .select({
          postId: post.postId,
          title: post.title,
          content: post.content,
          category: post.category,
          image1: post.image1,
          image2: post.image2,
          image3: post.image3,
          createdAt: post.createdAt,
          userId: post.userId,
        })
        .from(post)
        .where(where)
        .orderBy(desc(post.createdAt))
        .limit(pageSize)
        .offset(offset),
      db.select({ total: count() }).from(post).where(where),
    ]);

    if (posts.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          items: [],
          pagination: { page, pageSize, total: 0, totalPages: 0 },
        },
      } satisfies ApiPaginationEnvelope<never>);
    }

    const postIds = posts.map((p) => p.postId);

    const [likeCounts, commentCounts, userLikes] = await Promise.all([
      db
        .select({ postId: postLikes.postId, cnt: count() })
        .from(postLikes)
        .where(and(inArray(postLikes.postId, postIds), eq(postLikes.status, 'ACTIVE')))
        .groupBy(postLikes.postId),
      db
        .select({ postId: comment.postId, cnt: count() })
        .from(comment)
        .where(and(inArray(comment.postId, postIds), eq(comment.status, 'ACTIVE')))
        .groupBy(comment.postId),
      currentUserId
        ? db
            .select({ postId: postLikes.postId })
            .from(postLikes)
            .where(
              and(
                inArray(postLikes.postId, postIds),
                eq(postLikes.userId, currentUserId),
                eq(postLikes.status, 'ACTIVE'),
              ),
            )
        : Promise.resolve([]),
    ]);

    const likeMap = Object.fromEntries(likeCounts.map((l) => [l.postId, l.cnt]));
    const commentMap = Object.fromEntries(commentCounts.map((c) => [c.postId, c.cnt]));
    const likedSet = new Set(userLikes.map((l) => l.postId));

    const items = posts.map((p) => ({
      ...p,
      likeCount: likeMap[p.postId] ?? 0,
      commentCount: commentMap[p.postId] ?? 0,
      liked: likedSet.has(p.postId),
    }));

    return NextResponse.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    } satisfies ApiPaginationEnvelope<(typeof items)[number]>);
  } catch (err) {
    console.error('[GET /api/posts]', err);
    return NextResponse.json(
      { success: false, error: { message: '게시글 목록 조회 실패' } } satisfies ApiEnvelope<never>,
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json(
        { success: false, error: { message: '로그인이 필요합니다.' } } satisfies ApiEnvelope<never>,
        { status: 401 },
      );
    }

    const body = await req.json();
    const { title, content, category, image1, image2, image3 } = body;

    if (!title?.trim() || !content?.trim() || !category?.trim()) {
      return NextResponse.json(
        { success: false, error: { message: '제목, 내용, 카테고리는 필수입니다.' } } satisfies ApiEnvelope<never>,
        { status: 400 },
      );
    }

    const [created] = await db
      .insert(post)
      .values({
        userId: session.user.id,
        title: title.trim(),
        content: content.trim(),
        category,
        image1: image1 ?? null,
        image2: image2 ?? null,
        image3: image3 ?? null,
      })
      .$returningId();

    return NextResponse.json(
      { success: true, data: { postId: created.postId } } satisfies ApiEnvelope<{ postId: number }>,
      { status: 201 },
    );
  } catch (err) {
    console.error('[POST /api/posts]', err);
    return NextResponse.json({ success: false, error: { message: '게시글 작성 실패' } } satisfies ApiEnvelope<never>, {
      status: 500,
    });
  }
}
