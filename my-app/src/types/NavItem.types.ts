import { type PostCategory } from '@/lib/constants';

export type NavItemProps = {
  category: PostCategory;
  isActive: boolean;
  emoji?: string;
  onClick: () => void;
};
