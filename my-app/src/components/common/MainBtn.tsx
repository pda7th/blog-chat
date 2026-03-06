import { MainBtnProps } from '@/types/MainBtn.types';

export default function MainBtn({ children, className, onClick, disabled }: MainBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center rounded-xl bg-[#00C471] px-16pxr py-9pxr shadow-sm transition-all duration-150 hover:bg-green-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ''}`}>
      <span className="fonts-mainBtn">{children}</span>
    </button>
  );
}
