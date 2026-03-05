import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { post, postLikes, comment } from '@/db/schema/post';
import { user } from '@/db/schema/auth';
import { auth } from '@/lib/auth';
import { eq, and, count } from 'drizzle-orm';
import { headers } from 'next/headers';

type Params = { params: Promise<{ postId: string }> };

// GET /api/posts/[postId]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { postId } = await params;
    const id = Number(postId);
    if (!id) return NextResponse.json({ message: '잘못된 postId' }, { status: 400 });

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

    if (!found) return NextResponse.json({ message: '게시글을 찾을 수 없습니다.' }, { status: 404 });

    const [{ likeCount }] = await db
      .select({ likeCount: count() })
      .from(postLikes)
      .where(and(eq(postLikes.postId, id), eq(postLikes.status, 'ACTIVE')));

    const [{ commentCount }] = await db
      .select({ commentCount: count() })
      .from(comment)
      .where(and(eq(comment.postId, id), eq(comment.status, 'ACTIVE')));

    return NextResponse.json({ ...found, likeCount, commentCount });
  } catch (err) {
    console.error('[GET /api/posts/[postId]]', err);
    return NextResponse.json({ message: '게시글 조회 실패' }, { status: 500 });
  }
}

// PATCH /api/posts/[postId]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    // const session = await auth.api.getSession({ headers: await headers() });
    // if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });

    const { postId } = await params;
    const id = Number(postId);
    if (!id) return NextResponse.json({ message: '잘못된 postId' }, { status: 400 });

    const [existing] = await db
      .select({ userId: post.userId })
      .from(post)
      .where(and(eq(post.postId, id), eq(post.status, 'ACTIVE')));

    if (!existing) return NextResponse.json({ message: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    // if (existing.userId !== session.user.id) {
    //   return NextResponse.json({ message: '수정 권한이 없습니다.' }, { status: 403 });
    // }

    const body = await req.json();
    const { title, content, category, image1, image2, image3 } = body;

    if (!title?.trim() || !content?.trim() || !category?.trim()) {
      return NextResponse.json({ message: '제목, 내용, 카테고리는 필수입니다.' }, { status: 400 });
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

    return NextResponse.json({ postId: id });
  } catch (err) {
    console.error('[PATCH /api/posts/[postId]]', err);
    return NextResponse.json({ message: '게시글 수정 실패' }, { status: 500 });
  }
}

// DELETE /api/posts/[postId]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    //const session = await auth.api.getSession({ headers: await headers() });
    //if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });

    const { postId } = await params;
    const id = Number(postId);
    if (!id) return NextResponse.json({ message: '잘못된 postId' }, { status: 400 });

    const [existing] = await db
      .select({ userId: post.userId })
      .from(post)
      .where(and(eq(post.postId, id), eq(post.status, 'ACTIVE')));

    if (!existing) return NextResponse.json({ message: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    //if (existing.userId !== session.user.id) {
    //  return NextResponse.json({ message: '삭제 권한이 없습니다.' }, { status: 403 });
    //}

    await db.update(post).set({ status: 'DELETED' }).where(eq(post.postId, id));

    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (err) {
    console.error('[DELETE /api/posts/[postId]]', err);
    return NextResponse.json({ message: '게시글 삭제 실패' }, { status: 500 });
  }
}
