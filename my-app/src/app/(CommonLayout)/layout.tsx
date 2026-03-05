import { Suspense } from 'react';
import NavBar from '@/components/common/NavBar/NavBar';

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="px-50pxr">
      <Suspense>
        <NavBar />
      </Suspense>
      <div className="children-container flex">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </main>
  );
}
