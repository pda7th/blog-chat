type MainBtnProps = {
  children: React.ReactNode;
};

export default function MainBtn({ children }: MainBtnProps) {
  return (
    <button className="flex flex-col items-center justify-center rounded-lg bg-[#00C471] px-16pxr py-8pxr">
      <span className="fonts-mainBtn text-white">{children}</span>
    </button>
  );
}
