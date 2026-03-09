'use client';

import { useEffect, useRef, useState } from 'react';

type NotificationItem = {
  notificationId: number;
  postId: number;
  commentId: number;
  postTitle: string;
  commenterName: string;
  commentPreview: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    const res = await fetch('/api/notifications');
    if (!res.ok) return;
    const json = await res.json();
    if (json.success) {
      setUnreadCount(json.data.unreadCount);
      setItems(json.data.items);
    }
  }

  // 초기 로드
  useEffect(() => {
    fetchNotifications();
  }, []);

  // SSE 연결
  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = () => {
      fetchNotifications();
    };

    // onerror 시 close() 호출하지 않으면 EventSource가 자동 재연결함

    return () => eventSource.close();
  }, []);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleOpen() {
    setOpen((prev) => !prev);
    if (!open && unreadCount > 0) {
      const ids = items.map((item) => item.notificationId);
      await fetch('/api/notifications/read', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) });
      setUnreadCount(0);
    }
  }

  function handleNotificationClick(item: NotificationItem) {
    setOpen(false);
    window.location.href = `/home/${item.postId}#comment-${item.commentId}`;
  }

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        onClick={handleOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-100 bg-gray-50 shadow-sm transition-all duration-200 hover:border-green-300 hover:ring-2 hover:ring-green-400/30 active:scale-95"
        aria-label="알림"
      >
        {/* 벨 아이콘 */}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* 뱃지 */}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 드롭다운 */}
      {open && (
        <div className="absolute right-0 top-11 z-[200] w-72 rounded-2xl border border-gray-100 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <span className="text-sm font-bold text-gray-700">알림</span>
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-400">새 알림이 없습니다.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-gray-50 overflow-y-auto">
              {items.map((item) => (
                <li key={item.notificationId}>
                  <button
                    onClick={() => handleNotificationClick(item)}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-green-50"
                  >
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                      {item.commenterName}님이 댓글을 달았습니다
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                      {item.postTitle}
                    </p>
                    <p className="mt-1 text-xs text-gray-400 line-clamp-1">
                      "{item.commentPreview}"
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
