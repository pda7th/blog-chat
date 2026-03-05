import type { PostCategory } from '@/lib/constants';
import type { ApiEnvelope, ApiPaginationEnvelope } from '@/types/api-envelopes';

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

export type CreatePostInput = {
  title: string;
  content: string;
  category: string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
};

export type UpdatePostInput = CreatePostInput;

export async function fetchPosts(params?: { category?: PostCategory; page?: number; pageSize?: number }) {
  const query = new URLSearchParams();
  if (params?.category && params.category !== '전체') query.set('category', params.category);
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));

  const res = await fetch(`/api/posts?${query.toString()}`);
  const json: ApiPaginationEnvelope<PostSummary> = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

export async function fetchPost(postId: number) {
  const res = await fetch(`/api/posts/${postId}`);
  const json: ApiEnvelope<PostDetail> = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

export async function createPost(input: CreatePostInput) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json: ApiEnvelope<{ postId: number }> = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

export async function updatePost(postId: number, input: UpdatePostInput) {
  const res = await fetch(`/api/posts/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json: ApiEnvelope<{ postId: number }> = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

export async function deletePost(postId: number) {
  const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
  const json: ApiEnvelope<{ message: string }> = await res.json();
  if (!json.success) throw new Error(json.error.message);
}

export async function uploadPostImage(file: File, folder = 'posts'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', {
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

export async function toggleLike(postId: number): Promise<{ liked: boolean }> {
  const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
  const json: ApiEnvelope<{ liked: boolean }> = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}
