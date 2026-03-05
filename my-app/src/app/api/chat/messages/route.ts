import { db } from '@/db';
import { chat } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { user } from '@/db/schema/auth';

const ROOM_ID = 1;
const MESSAGE_LIMIT = 50;

export async function GET() {
  // TODO: 로그인 구현 후 아래 주석 복구
  // const session = await auth.api.getSession({ headers: await headers() });
  // if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const messages = await db
    .select({
      chatId: chat.chatId,
      content: chat.content,
      createdAt: chat.createdAt,
      userId: chat.userId,
      nickname: user.nickname,
      userProfileImageUrl: user.userProfileImageUrl,
    })
    .from(chat)
    .innerJoin(user, eq(chat.userId, user.id))
    .where(eq(chat.roomId, ROOM_ID))
    .orderBy(desc(chat.createdAt))
    .limit(MESSAGE_LIMIT);

  return Response.json(messages.reverse());
}
