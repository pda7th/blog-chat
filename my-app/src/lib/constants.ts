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

export const TEMPLATES = {
  수업: `<p>📚 <strong>오늘 배운 것</strong></p><p></p><p>💡 <strong>핵심 포인트</strong></p><p></p><p>🤔 <strong>궁금한 점</strong></p><p></p>`,
  회고: `<p>✅ <strong>잘한 점</strong></p><p></p><p>🔧 <strong>개선할 점</strong></p><p></p><p>📌 <strong>내일 할 일</strong></p><p></p>`,
};

export const COLORS = ['#000000', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6'];
export const FONTS = ['기본', 'Arial', 'Georgia', 'Courier New'];
