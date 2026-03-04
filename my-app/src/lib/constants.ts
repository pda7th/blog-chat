export const POST_CATEGORIES = ['전체', '수업', '학습정리', '자격증', '알고리즘', '점심인증'] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

export const CATEGORY_EMOJI: Record<PostCategory, string> = {
  전체: '',
  수업: '🌱',
  학습정리: '📝',
  자격증: '🏆',
  알고리즘: '💻',
  점심인증: '🍱',
};
