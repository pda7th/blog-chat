// import NavBar from '@components/common/NavBar/NavBar'; 이런식으로 메뉴 가져오기

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="children-container">{children}</div>;
}
