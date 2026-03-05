import type { PostCategory } from '@/lib/constants';

export type PostSummary = {
  postId: number;
  title: string;
  content: string;
  category: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  createdAt: string;
  userId: string;
  likeCount: number;
  commentCount: number;
};

export type PostDetail = PostSummary & {
  updatedAt: string;
  authorName: string;
  authorNickname: string | null;
  authorProfileImage: string | null;
};

export type PostListResponse = {
  posts: PostSummary[];
  page: number;
  limit: number;
};

export type CreatePostInput = {
  title: string;
  content: string;
  category: string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
};

export type UpdatePostInput = CreatePostInput;

// 게시글 목록 조회
export async function fetchPosts(params?: {
  category?: PostCategory;
  page?: number;
  limit?: number;
}): Promise<PostListResponse> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== '전체') query.set('category', params.category);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const res = await fetch(`/api/posts?${query.toString()}`);
  if (!res.ok) throw new Error('게시글 목록 조회 실패');
  return res.json();
}

// 게시글 상세 조회
export async function fetchPost(postId: number): Promise<PostDetail> {
  const res = await fetch(`/api/posts/${postId}`);
  if (!res.ok) throw new Error('게시글 조회 실패');
  return res.json();
}

// 게시글 작성
export async function createPost(input: CreatePostInput): Promise<{ postId: number }> {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? '게시글 작성 실패');
  }
  return res.json();
}

// 게시글 수정
export async function updatePost(postId: number, input: UpdatePostInput): Promise<{ postId: number }> {
  const res = await fetch(`/api/posts/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? '게시글 수정 실패');
  }
  return res.json();
}

// 게시글 삭제
export async function deletePost(postId: number): Promise<void> {
  const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? '게시글 삭제 실패');
  }
}

// 이미지 업로드 (FormData → 서버 → S3)
export async function uploadPostImage(file: File, folder = 'posts'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/posts/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? '이미지 업로드 실패');
  }

  const { url } = await res.json();
  return url;
}
