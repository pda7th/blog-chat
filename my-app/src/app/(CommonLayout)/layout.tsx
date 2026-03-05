import { Suspense } from 'react';
import NavBar from '@/components/common/NavBar/NavBar';
import ChatSidebar from '@/components/chat/ChatSidebar';

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
      <div className="children-container flex">
        <div className="flex-1 overflow-y-auto">{children}</div>
        <Suspense>
          <ChatSidebar />
        </Suspense>
      </div>
    </>
  );
}
