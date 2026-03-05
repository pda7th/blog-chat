import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { eq } from 'drizzle-orm';
import { room } from './schema';

async function seed() {
  const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL! });
  const db = drizzle(connection);

  const [existing] = await db.select().from(room).where(eq(room.title, '전체 채팅')).limit(1);
  if (!existing) {
    await db.insert(room).values({ title: '전체 채팅' });
    console.log('✅ 채팅방 생성 완료');
  } else {
    console.log(`ℹ️ 채팅방 이미 존재 (room_id: ${existing.roomId})`);
  }

  await connection.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
