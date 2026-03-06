import { db } from '@/db';
import { chat, room } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { user } from '@/db/schema/auth';
import { broadcast } from '@/app/api/chat/stream/route';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const GLOBAL_ROOM_TITLE = '전체 채팅';

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { content } = await request.json();

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return Response.json({ error: 'content is required' }, { status: 400 });
  }

  const [globalRoom] = await db.select().from(room).where(eq(room.title, GLOBAL_ROOM_TITLE)).limit(1);
  if (!globalRoom) return Response.json({ error: '채팅방을 찾을 수 없습니다.' }, { status: 404 });

  const [inserted] = await db
    .insert(chat)
    .values({
      roomId: globalRoom.roomId,
      userId: session.user.id,
      content: content.trim(),
    })
    .$returningId();

  const [newMessage] = await db
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
    .where(eq(chat.chatId, inserted.chatId));

  broadcast(newMessage);

  return Response.json(newMessage, { status: 201 });
}
