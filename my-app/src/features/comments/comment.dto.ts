export interface AuthorDto {
  userId: string;
  nickname: string | null;
}

export interface ReplyToDto {
  commentId: number;
  userId: string;
  nickname: string | null;
}

export interface CommentDto {
  commentId: number;
  postId: number;
  userId: string;
  parentId: number | null;
  replyToCommentId: number | null;
  content: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  createdAt: Date;
  updatedAt: Date;
  author: AuthorDto;
  replyTo?: ReplyToDto | null;
}
