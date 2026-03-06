'use client';

import { useEffect, useRef } from 'react';
import ChatMessage, { ChatMessageData } from './ChatMessage';

type Props = {
  messages: ChatMessageData[];
  currentUserId: string;
};

export default function ChatMessageList({ messages, currentUserId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 overflow-y-scroll py-2 [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
      {messages.map((msg) => (
        <ChatMessage key={msg.chatId} message={msg} isMe={msg.userId === currentUserId} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
