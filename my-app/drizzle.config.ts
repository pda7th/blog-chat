import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

// drizzle-kit은 .env.local을 자동으로 읽지 않음 (Next.js 전용)
config({ path: '.env.local' });

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'mysql',
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
