import { boolean, index, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { statusEnum } from './common';

// ── user ─────────────────────────────────────────────────────────────────────
// 변경 사항 (기존 users 테이블 대비):
//   - PK: bigserial userId → varchar(36) id  (BetterAuth UUID)
//   - 추가: name, emailVerified, image        (BetterAuth 필수)
//   - 유지: nickname, userProfileImageUrl, level, status (앱 전용 additionalFields)
//   - 제거: password, provider, providerId    (→ account 테이블로 이동)
export const user = mysqlTable(
  'user',
  {
    // BetterAuth 필수
    id: varchar('id', { length: 36 }).primaryKey(),
    name: text('name').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    image: text('image'),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().onUpdateNow(),
    // 앱 전용 (BetterAuth additionalFields로 등록)
    nickname: varchar('nickname', { length: 50 }),
    userProfileImageUrl: text('user_profile_image_url'),
    level: varchar('level', { length: 30 }).notNull().default('BEGINNER'),
    status: statusEnum.notNull().default('ACTIVE'),
  },
  (t) => ({
    emailIdx: index('idx_user_email').on(t.email),
  }),
);

// ── session ───────────────────────────────────────────────────────────────────
export const session = mysqlTable('session', {
  id: varchar('id', { length: 36 }).primaryKey(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().onUpdateNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

// ── account ───────────────────────────────────────────────────────────────────
// 기존 users.provider, users.providerId, users.password 가 여기로 이동
// providerId = 'credential' | 'google' | 'github' | 'kakao'
export const account = mysqlTable('account', {
  id: varchar('id', { length: 36 }).primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { mode: 'date' }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { mode: 'date' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().onUpdateNow(),
});

// ── verification ──────────────────────────────────────────────────────────────
export const verification = mysqlTable('verification', {
  id: varchar('id', { length: 36 }).primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().onUpdateNow(),
});

// ── jwks (JWT 플러그인) ────────────────────────────────────────────────────────
export const jwks = mysqlTable('jwks', {
  id: varchar('id', { length: 36 }).primaryKey(),
  publicKey: text('public_key').notNull(),
  privateKey: text('private_key').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});
