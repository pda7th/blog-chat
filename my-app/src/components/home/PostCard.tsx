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
  authorName,
  authorNickname,
  authorProfileImage,
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

  const displayName = authorNickname ?? authorName;
  const initial = displayName.charAt(0);

  return (
    <article className="flex w-full flex-col gap-14pxr rounded-2xl border border-gray-100 bg-white p-28pxr shadow-sm transition-all duration-200 hover:border-gray-200 hover:shadow-md">
      <span className="inline-flex w-fit items-center rounded-full bg-green-50 px-10pxr py-4pxr text-xs font-bold text-green-600">
        {subtitle}
      </span>
      <h2 className="fonts-postTitle leading-snug">{title}</h2>
      <div
        className="fonts-postContent line-clamp-3 overflow-hidden text-ellipsis"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      <div className="flex items-center gap-8pxr text-xs text-gray-400">
        {authorProfileImage ? (
          <img src={authorProfileImage} alt={displayName} className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
            {initial}
          </div>
        )}
        <span className="font-medium text-gray-600">{displayName}</span>
      </div>
      <section className="flex gap-14pxr border-t border-gray-50 pt-14pxr">
        <div className="flex items-center gap-5pxr text-gray-400">
          <CommentIcon />
          <p className="text-xs font-medium">{commentCount}</p>
        </div>
        <button
          onClick={handleLike}
          className="flex items-center gap-5pxr text-gray-400 transition-colors duration-150 hover:text-red-400"
        >
          {liked ? <LikeFilledIcon /> : <LikeStrokeIcon />}
          <p className="text-xs font-medium">{likeCount}</p>
        </button>
      </section>
    </article>
  );
}
