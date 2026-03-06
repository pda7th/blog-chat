import { CommentIcon, LikeIcon } from '../../../public/icon';
import { PostCardProps } from '@/types/PostCard.types';

export default function PostCard({ subtitle, title, content, commentCount, likeCount }: PostCardProps) {
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

        <div className="flex items-center gap-4pxr">
          <LikeIcon />
          <p className="fonts-subTitle">{likeCount}</p>
        </div>
      </section>
    </article>
  );
}
