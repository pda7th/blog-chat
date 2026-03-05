type MainBtnProps = {
  children: React.ReactNode;
  className?: string;
};

export default function MainBtn(props: MainBtnProps) {
  const { children, className } = props;
  return (
    <button
      className={`flex flex-col items-center justify-center rounded-lg bg-[#00C471] px-16pxr py-8pxr ${className ?? ''}`}>
      <span className="fonts-mainBtn">{children}</span>
    </button>
  );
}
