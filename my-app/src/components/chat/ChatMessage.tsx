'use client';

import Image from 'next/image';

export type ChatMessageData = {
  chatId: number;
  content: string;
  createdAt: Date | string;
  userId: string;
  nickname: string | null;
  image: string | null;
};

type Props = {
  message: ChatMessageData;
  isMe: boolean;
};

export default function ChatMessage({ message, isMe }: Props) {
  const time = new Date(message.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });

  const initial = message.nickname?.charAt(0) ?? '?';

  if (isMe) {
    return (
      <div className="flex justify-end gap-2 px-4 py-1">
        <div className="flex flex-col items-end gap-1 max-w-[70%]">
          <span className="text-[10px] text-gray-400">{time}</span>
          <div className="bg-green-500 text-white text-sm px-3 py-2 rounded-2xl rounded-tr-sm wrap-break-words">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 px-4 py-1">
      <div className="relative w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
        {message.image ? (
          <Image
            src={message.image}
            alt={message.nickname ?? ''}
            fill
            className="object-cover"
          />
        ) : (
          initial
        )}
      </div>
      <div className="flex flex-col gap-1 max-w-[70%]">
        <span className="text-xs text-gray-500 font-medium">{message.nickname ?? '익명'}</span>
        <div className="flex items-end gap-1">
          <div className="bg-white border border-gray-200 text-gray-800 text-sm px-3 py-2 rounded-2xl rounded-tl-sm wrap-break-word">
            {message.content}
          </div>
          <span className="text-[10px] text-gray-400 shrink-0">{time}</span>
        </div>
      </div>
    </div>
  );
}
