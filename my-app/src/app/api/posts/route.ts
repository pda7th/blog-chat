import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { post, postLikes, comment } from '@/db/schema/post';
import { auth } from '@/lib/auth';
import { eq, desc, and, count, inArray } from 'drizzle-orm';
import { headers } from 'next/headers';

// GET /api/posts?category=수업&page=1&limit=10
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? '10')));
    const offset = (page - 1) * limit;

    const where =
      category && category !== '전체'
        ? and(eq(post.status, 'ACTIVE'), eq(post.category, category))
        : eq(post.status, 'ACTIVE');

    const posts = await db
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
      .limit(limit)
      .offset(offset);

    if (posts.length === 0) {
      return NextResponse.json({ posts: [], page, limit });
    }

    const postIds = posts.map((p) => p.postId);

    const likeCounts = await db
      .select({ postId: postLikes.postId, cnt: count() })
      .from(postLikes)
      .where(and(inArray(postLikes.postId, postIds), eq(postLikes.status, 'ACTIVE')))
      .groupBy(postLikes.postId);

    const commentCounts = await db
      .select({ postId: comment.postId, cnt: count() })
      .from(comment)
      .where(and(inArray(comment.postId, postIds), eq(comment.status, 'ACTIVE')))
      .groupBy(comment.postId);

    const likeMap = Object.fromEntries(likeCounts.map((l) => [l.postId, l.cnt]));
    const commentMap = Object.fromEntries(commentCounts.map((c) => [c.postId, c.cnt]));

    const result = posts.map((p) => ({
      ...p,
      likeCount: likeMap[p.postId] ?? 0,
      commentCount: commentMap[p.postId] ?? 0,
    }));

    return NextResponse.json({ posts: result, page, limit });
  } catch (err) {
    console.error('[GET /api/posts]', err);
    return NextResponse.json({ message: '게시글 목록 조회 실패' }, { status: 500 });
  }
}

// POST /api/posts
export async function POST(req: NextRequest) {
  try {
    // const session = await auth.api.getSession({ headers: await headers() });
    // if (!session) {
    //  return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
    //}

    const body = await req.json();
    const { title, content, category, image1, image2, image3 } = body;

    if (!title?.trim() || !content?.trim() || !category?.trim()) {
      return NextResponse.json({ message: '제목, 내용, 카테고리는 필수입니다.' }, { status: 400 });
    }

    const [created] = await db
      .insert(post)
      .values({
        //userId: session.user.id,
        userId: 'test-user-id',
        title: title.trim(),
        content: content.trim(),
        category,
        image1: image1 ?? null,
        image2: image2 ?? null,
        image3: image3 ?? null,
      })
      .$returningId();

    return NextResponse.json({ postId: created.postId }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/posts]', err);
    return NextResponse.json({ message: '게시글 작성 실패' }, { status: 500 });
  }
}
