'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchPost, deletePost, toggleLike, type PostDetail } from '@/lib/post';
import { CommentIcon, LikeStrokeIcon, LikeFilledIcon } from '../../../../../public/icon/index';
import { useSession } from '@/lib/auth-client';
import { CommentSection } from '@/features/comments/CommentSection';

export default function PostDetailPage() {
  const { postId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ?? undefined;
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchPost(Number(postId))
      .then((data) => {
        setPost(data);
        setLikeCount(data.likeCount);
        setLiked(data.liked);
      })
      .catch(console.error);
  }, [postId]);

  const handleDelete = async () => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return;
    setIsDeleting(true);
    try {
      await deletePost(Number(postId));
      router.push('/home');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    try {
      const { liked: newLiked } = await toggleLike(Number(postId));
      setLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  if (!post) return (
    <div className="flex items-center justify-center gap-2 py-20 text-sm text-gray-400">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
      <span>불러오는 중...</span>
    </div>
  );

  return (
    <main className="flex flex-col gap-24pxr py-32pxr">
      <button
        onClick={() => router.back()}
        className="self-start flex items-center gap-1 rounded-full border border-gray-200 bg-white px-12pxr py-6pxr text-sm text-gray-500 shadow-sm transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 active:scale-95"
      >
        ← 목록으로
      </button>
      <article className="flex w-full flex-col gap-20pxr rounded-2xl border border-gray-100 bg-white p-32pxr shadow-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-green-50 px-10pxr py-4pxr text-xs font-bold text-green-600">
            {post.category}
          </span>
          <div className="flex gap-8pxr">
            <button
              onClick={() => router.push(`/home/${postId}/edit`)}
              className="rounded-lg border border-gray-200 px-12pxr py-6pxr text-xs font-medium text-gray-600 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50">
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg border border-red-100 px-12pxr py-6pxr text-xs font-medium text-red-400 transition-all duration-150 hover:border-red-200 hover:bg-red-50 disabled:opacity-50">
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>

        <h1 className="fonts-postTitle text-2xl">{post.title}</h1>

        <div className="flex items-center gap-8pxr text-xs text-gray-400">
          {post.authorProfileImage ? (
            <img src={post.authorProfileImage} alt={post.authorNickname ?? post.authorName} className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
              {(post.authorNickname ?? post.authorName ?? '?').charAt(0)}
            </div>
          )}
          <span className="font-medium text-gray-600">{post.authorNickname ?? post.authorName}</span>
          <span>·</span>
          <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
        </div>

        {(post.image1 || post.image2 || post.image3) && (
          <div className="flex gap-12pxr">
            {post.image1 && <img src={post.image1} alt="이미지1" className="h-48 w-48 rounded-xl object-cover shadow-sm" />}
            {post.image2 && <img src={post.image2} alt="이미지2" className="h-48 w-48 rounded-xl object-cover shadow-sm" />}
            {post.image3 && <img src={post.image3} alt="이미지3" className="h-48 w-48 rounded-xl object-cover shadow-sm" />}
          </div>
        )}

        <div className="fonts-postContent" dangerouslySetInnerHTML={{ __html: post.content }}></div>

        {/* 좋아요/댓글 */}
        <section className="flex gap-14pxr border-t border-gray-100 pt-16pxr">
          <div className="flex items-center gap-5pxr text-gray-400">
            <CommentIcon />
            <p className="text-xs font-medium">댓글 {post.commentCount}</p>
          </div>
          <button onClick={handleLike} className="flex items-center gap-5pxr text-gray-400 transition-colors duration-150 hover:text-red-400">
            {liked ? <LikeFilledIcon /> : <LikeStrokeIcon />}
            <p className="text-xs font-medium">좋아요 {likeCount}</p>
          </button>
        </section>
      </article>

      <CommentSection postId={Number(postId)} currentUserId={currentUserId} />
    </main>
  );
}
