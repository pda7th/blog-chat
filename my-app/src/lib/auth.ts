import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { jwt } from 'better-auth/plugins';
import { db } from '@/db';
import * as schema from '@/db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'mysql',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      jwks: schema.jwks,
    },
  }),

  emailAndPassword: { enabled: true },

  // 환경변수가 있을 때만 해당 provider 등록 (없으면 이메일/비밀번호 로그인만 동작)
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    }),
    ...(process.env.GITHUB_CLIENT_ID && {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
    }),
    ...(process.env.KAKAO_CLIENT_ID && {
      kakao: {
        clientId: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      },
    }),
  },

  // 앱 전용 추가 필드 — 클라이언트 타입 추론 및 API 응답에 포함
  user: {
    additionalFields: {
      nickname: { type: 'string', required: false },
      userProfileImageUrl: { type: 'string', required: false },
      level: { type: 'string', required: false, defaultValue: 'BEGINNER' },
      status: { type: 'string', required: false, defaultValue: 'ACTIVE' },
    },
  },

  plugins: [jwt()],

  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
