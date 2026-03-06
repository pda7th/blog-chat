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
    timeZone: 'Asia/Seoul',
  });

  const initial = message.nickname?.charAt(0) ?? '?';

  if (isMe) {
    return (
      <div className="flex justify-end gap-2 px-4 py-1.5">
        <div className="flex flex-col items-end gap-1 max-w-[72%]">
          <span className="text-[10px] text-gray-400">{time}</span>
          <div className="break-words rounded-2xl rounded-tr-sm bg-[#00C471] px-3.5 py-2 text-sm text-white shadow-sm">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 px-4 py-1.5">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-xs font-bold text-green-700 ring-1 ring-green-100">
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
      <div className="flex flex-col gap-1 max-w-[72%]">
        <span className="text-[11px] font-semibold text-gray-500">{message.nickname ?? '익명'}</span>
        <div className="flex items-end gap-1">
          <div className="break-words rounded-2xl rounded-tl-sm border border-gray-100 bg-gray-50 px-3.5 py-2 text-sm text-gray-800 shadow-sm">
            {message.content}
          </div>
          <span className="shrink-0 text-[10px] text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  );
}
