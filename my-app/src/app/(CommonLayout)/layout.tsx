import { Suspense } from 'react';
import NavBar from '@/components/common/NavBar/NavBar';

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense>
        <NavBar />
      </Suspense>
      <div className="children-container">{children}</div>
    </>
  );
}
