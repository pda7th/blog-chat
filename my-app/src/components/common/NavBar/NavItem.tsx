import { NavItemProps } from '@/types/NavItem.types';

export default function NavItem({ category, isActive, emoji, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'fonts-navBar flex items-center gap-4pxr rounded-full px-14pxr py-7pxr transition-all duration-200 whitespace-nowrap',
        isActive
          ? 'bg-[#00C471] text-white shadow-sm shadow-green-200'
          : 'border border-gray-200 bg-white text-gray-500 hover:border-green-300 hover:text-[#00C471] hover:bg-green-50',
      ].join(' ')}>
      {emoji && <span className="leading-none">{emoji}</span>}
      <span>{category}</span>
    </button>
  );
}
