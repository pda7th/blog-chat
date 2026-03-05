import { db } from '@/db';
import { chat, room } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { user } from '@/db/schema/auth';

const GLOBAL_ROOM_TITLE = '전체 채팅';
const MESSAGE_LIMIT = 50;

export async function GET() {
  const [globalRoom] = await db.select().from(room).where(eq(room.title, GLOBAL_ROOM_TITLE)).limit(1);
  if (!globalRoom) return Response.json([]);

  const messages = await db
    .select({
      chatId: chat.chatId,
      content: chat.content,
      createdAt: chat.createdAt,
      userId: chat.userId,
      nickname: user.nickname,
      image: user.image,
    })
    .from(chat)
    .innerJoin(user, eq(chat.userId, user.id))
    .where(eq(chat.roomId, globalRoom.roomId))
    .orderBy(desc(chat.createdAt))
    .limit(MESSAGE_LIMIT);

  return Response.json(messages.reverse());
}
