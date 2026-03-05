import { MainBtnProps } from '@/types/MainBtn.types';

export default function MainBtn({ children, className, onClick, disabled }: MainBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center rounded-lg bg-[#00C471] px-16pxr py-8pxr disabled:opacity-50 ${className ?? ''}`}>
      <span className="fonts-mainBtn">{children}</span>
    </button>
  );
}
