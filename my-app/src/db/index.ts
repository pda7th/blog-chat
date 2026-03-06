import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+00:00',
});

export const db = drizzle(pool, { schema, mode: 'default' });
export type DB = typeof db;
