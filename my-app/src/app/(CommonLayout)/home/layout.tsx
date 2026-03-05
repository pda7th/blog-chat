import { Suspense } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-110px)]">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <Suspense>
        <ChatSidebar />
      </Suspense>
    </div>
  );
}
