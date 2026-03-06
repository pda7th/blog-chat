import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { post, postLikes, comment } from '@/db/schema/post';
import { eq, desc, and, count, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { ApiEnvelope, ApiPaginationEnvelope } from '@/types/api-envelopes';

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json(
                { success: false, error: { message: '로그인이 필요합니다.' } } satisfies ApiEnvelope<never>,
                { status: 401 },
            );
        }

        const userId = session.user.id;
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
        const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') ?? '10')));
        const offset = (page - 1) * pageSize;

        const where = and(eq(post.status, 'ACTIVE'), eq(post.userId, userId));

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

        const [likeCounts, commentCounts] = await Promise.all([
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
        ]);

        const likeMap = Object.fromEntries(likeCounts.map((l) => [l.postId, l.cnt]));
        const commentMap = Object.fromEntries(commentCounts.map((c) => [c.postId, c.cnt]));

        const items = posts.map((p) => ({
            ...p,
            likeCount: likeMap[p.postId] ?? 0,
            commentCount: commentMap[p.postId] ?? 0,
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
        console.error('[GET /api/user/my-posts]', err);
        return NextResponse.json(
            { success: false, error: { message: '내 게시글 목록 조회 실패' } } satisfies ApiEnvelope<never>,
            { status: 500 },
        );
    }
}
