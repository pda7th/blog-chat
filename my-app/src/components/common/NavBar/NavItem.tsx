import { NavItemProps } from '@/types/NavItem.types';

export default function NavItem({ category, isActive, emoji, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'fonts-navBar flex items-center gap-4pxr rounded-full px-16pxr py-8pxr transition-all',
        isActive
          ? 'bg-green-500 text-white'
          : 'border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-500',
      ].join(' ')}>
      {emoji && <span className="leading-none">{emoji}</span>}
      <span>{category}</span>
    </button>
  );
}
