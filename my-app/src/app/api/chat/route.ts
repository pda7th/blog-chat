import { db } from '@/db';
import { chat } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { user } from '@/db/schema/auth';
import { broadcast } from '@/app/api/chat/stream/route';

const ROOM_ID = 1;

const TEST_USER_ID = 'test-user-id'; // TODO: 로그인 구현 후 제거

export async function POST(request: Request) {
  // TODO: 로그인 구현 후 아래 주석 복구
  // const session = await auth.api.getSession({ headers: await headers() });
  // if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { content, userId } = await request.json();

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return Response.json({ error: 'content is required' }, { status: 400 });
  }

  const [inserted] = await db
    .insert(chat)
    .values({
      roomId: ROOM_ID,
      userId: userId ?? TEST_USER_ID,
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
      userProfileImageUrl: user.userProfileImageUrl,
    })
    .from(chat)
    .innerJoin(user, eq(chat.userId, user.id))
    .where(eq(chat.chatId, inserted.chatId));

  broadcast(newMessage);

  return Response.json(newMessage, { status: 201 });
}
