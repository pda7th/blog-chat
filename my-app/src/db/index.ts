import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  waitForConnections: true,
  connectionLimit: 10,
});

// MySQL 서버 timezone에 관계없이 커넥션마다 UTC로 고정
// 풀 커넥션 수(10개)만큼만 실행되므로 성능 영향 없음
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pool as any).pool.on('connection', (connection: any) => {
  connection.query("SET time_zone = '+00:00'");
});

export const db = drizzle(pool, { schema, mode: 'default' });
export type DB = typeof db;
