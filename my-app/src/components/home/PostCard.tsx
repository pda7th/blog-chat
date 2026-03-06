'use client';

import { useState } from 'react';
import { CommentIcon, LikeStrokeIcon, LikeFilledIcon } from '../../../public/icon';
import { PostCardProps } from '@/types/PostCard.types';
import { toggleLike } from '@/lib/post';

export default function PostCard({
  postId,
  subtitle,
  title,
  content,
  commentCount,
  likeCount: initialLikeCount,
  liked: initialLiked = false,
}: PostCardProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { liked: newLiked } = await toggleLike(postId);
      setLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article className="flex w-full flex-col gap-13pxr rounded-lg border border-[#E9ECEF] bg-white p-25pxr">
      <p className="fonts-postSubtitle">{subtitle}</p>
      <h2 className="fonts-postTitle">{title}</h2>
      <div className="fonts-postContent" dangerouslySetInnerHTML={{ __html: content }}></div>
      <section className="flex gap-12pxr">
        <div className="flex items-center gap-4pxr">
          <CommentIcon />
          <p className="fonts-subTitle">{commentCount}</p>
        </div>
        <button onClick={handleLike} className="flex items-center gap-4pxr">
          {liked ? <LikeFilledIcon /> : <LikeStrokeIcon />}
          <p className="fonts-subTitle">{likeCount}</p>
        </button>
      </section>
    </article>
  );
}
