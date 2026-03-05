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
    <div className="flex-1 overflow-y-auto py-2">
      {messages.map((msg) => (
        <ChatMessage key={msg.chatId} message={msg} isMe={msg.userId === currentUserId} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
