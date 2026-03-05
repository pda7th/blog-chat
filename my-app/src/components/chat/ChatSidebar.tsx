'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // TODO: 로그인 구현 후 제거
// TODO: 로그인 구현 후 아래 주석 복구
// import { useSession } from '@/lib/auth-client';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { ChatMessageData } from './ChatMessage';

const TEST_USER_ID = 'test-user-id'; // TODO: 로그인 구현 후 제거

export default function ChatSidebar() {
  // TODO: 로그인 구현 후 아래 주석 복구
  // const { data: session } = useSession();
  const searchParams = useSearchParams(); // TODO: 로그인 구현 후 제거
  const currentUserId = searchParams.get('userId') ?? TEST_USER_ID; // TODO: 로그인 구현 후 session.user.id 로 교체
  const [messages, setMessages] = useState<ChatMessageData[]>([]);

  // 초기 메시지 로드
  useEffect(() => {
    fetch('/api/chat/messages')
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []));
  }, []);

  // SSE 연결
  useEffect(() => {
    const eventSource = new EventSource(`/api/chat/stream?userId=${currentUserId}`);

    eventSource.onmessage = (e) => {
      const newMessage: ChatMessageData = JSON.parse(e.data);
      setMessages((prev) => [...prev, newMessage]);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [currentUserId]);

  const handleSend = async (content: string) => {
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, userId: currentUserId }), // TODO: 로그인 구현 후 userId 제거
    });
  };

  return (
    <aside className="flex flex-col w-[320px] h-full border-l border-gray-100 bg-gray-50">
      <div className="px-4 py-3 border-b border-gray-100 bg-white">
        <h2 className="text-sm font-semibold text-gray-700">실시간 채팅</h2>
      </div>

      <ChatMessageList messages={messages} currentUserId={currentUserId} />

      <ChatInput onSend={handleSend} />
    </aside>
  );
}
