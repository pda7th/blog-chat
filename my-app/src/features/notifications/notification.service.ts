import { and, count, desc, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { notification } from '@/db/schema';

export type NotificationDto = {
  notificationId: number;
  postId: number;
  commentId: number;
  postTitle: string;
  commenterName: string;
  commentPreview: string;
  isRead: boolean;
  createdAt: Date;
};

export async function createNotification(data: {
  userId: string;
  postId: number;
  commentId: number;
  postTitle: string;
  commenterName: string;
  commentPreview: string;
}): Promise<NotificationDto> {
  const [result] = await db.insert(notification).values(data);
  const [inserted] = await db
    .select()
    .from(notification)
    .where(eq(notification.notificationId, result.insertId))
    .limit(1);
  return inserted;
}

export async function getUnreadNotifications(userId: string): Promise<{ unreadCount: number; items: NotificationDto[] }> {
  const unreadWhere = and(eq(notification.userId, userId), eq(notification.isRead, false));

  const [{ unreadCount }] = await db
    .select({ unreadCount: count() })
    .from(notification)
    .where(unreadWhere);

  const items = await db
    .select()
    .from(notification)
    .where(unreadWhere)
    .orderBy(desc(notification.createdAt));

  return { unreadCount, items };
}

export async function markNotificationsAsRead(userId: string, ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  await db
    .update(notification)
    .set({ isRead: true })
    .where(and(eq(notification.userId, userId), inArray(notification.notificationId, ids)));
}
