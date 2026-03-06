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

  if (!post) return <div className="p-32pxr text-gray-400">불러오는 중...</div>;

  return (
    <main className="flex flex-col gap-24pxr py-32pxr">
      <button onClick={() => router.back()} className="self-start text-sm text-gray-400 hover:text-gray-600">
        ← 목록으로
      </button>
      <article className="flex w-full flex-col gap-20pxr rounded-lg border border-[#E9ECEF] bg-white p-32pxr">
        <div className="flex items-center justify-between">
          <p className="fonts-postSubtitle">{post.category}</p>
          <div className="flex gap-8pxr">
            <button
              onClick={() => router.push(`/home/${postId}/edit`)}
              className="rounded border border-gray-200 px-12pxr py-6pxr text-sm text-gray-600 hover:bg-gray-50">
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded border border-red-200 px-12pxr py-6pxr text-sm text-red-500 hover:bg-red-50 disabled:opacity-50">
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>

        <h1 className="fonts-postTitle">{post.title}</h1>

        <div className="flex items-center gap-8pxr text-sm text-gray-400">
          <span>{post.authorNickname ?? post.authorName}</span>
          <span>·</span>
          <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
        </div>

        {(post.image1 || post.image2 || post.image3) && (
          <div className="flex gap-8pxr">
            {post.image1 && <img src={post.image1} alt="이미지1" className="h-48 w-48 rounded object-cover" />}
            {post.image2 && <img src={post.image2} alt="이미지2" className="h-48 w-48 rounded object-cover" />}
            {post.image3 && <img src={post.image3} alt="이미지3" className="h-48 w-48 rounded object-cover" />}
          </div>
        )}

        <div className="fonts-postContent" dangerouslySetInnerHTML={{ __html: post.content }}></div>

        {/* 좋아요/댓글 */}
        <section className="flex gap-12pxr border-t border-gray-100 pt-16pxr">
          <div className="flex items-center gap-4pxr">
            <CommentIcon />
            <p className="fonts-subTitle">댓글 {post.commentCount}</p>
          </div>
          <button onClick={handleLike} className="flex items-center gap-4pxr">
            {liked ? <LikeFilledIcon /> : <LikeStrokeIcon />}
            <p className="fonts-subTitle">좋아요 {likeCount}</p>
          </button>
        </section>
      </article>

      <CommentSection postId={Number(postId)} currentUserId={currentUserId} />
    </main>
  );
}
