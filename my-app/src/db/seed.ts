import { config } from 'dotenv';
config({ path: '.env.local' });

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { room } from './schema';
import { user } from './schema/auth';

async function seed() {
  const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL! });
  const db = drizzle(connection);

  await db.insert(room).values({ title: '전체 채팅' }).onDuplicateKeyUpdate({ set: { title: '전체 채팅' } });
  console.log('✅ 채팅방 생성 완료 (room_id: 1)');

  await db.insert(user).values({
    id: 'test-user-id',
    name: '테스트유저',
    email: 'test@test.com',
    emailVerified: false,
    nickname: '테스트유저',
    userProfileImageUrl: null,
  }).onDuplicateKeyUpdate({ set: { name: '테스트유저' } });
  console.log('✅ 테스트 유저 생성 완료 (id: test-user-id)');

  await db.insert(user).values({
    id: 'test-user-id-2',
    name: '테스트유저2',
    email: 'test2@test.com',
    emailVerified: false,
    nickname: '테스트유저2',
    userProfileImageUrl: null,
  }).onDuplicateKeyUpdate({ set: { name: '테스트유저2' } });
  console.log('✅ 테스트 유저2 생성 완료 (id: test-user-id-2)');

  await connection.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
