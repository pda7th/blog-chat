export type PostCardProps = {
  postId: number;
  subtitle: string;
  title: string;
  content: string;
  commentCount: number;
  likeCount: number;
  liked?: boolean;
  authorName: string;
  authorNickname: string | null;
  authorProfileImage: string | null;
};
