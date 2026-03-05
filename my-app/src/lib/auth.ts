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

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const defaultImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
          if (!user.image) {
            user.image = defaultImage;
          }
          // 하위 호환성을 위해 기존 필드도 동일하게 설정
          user.userProfileImageUrl = user.image;

          // 닉네임이 없을 경우 이름으로 초기화
          if (!user.nickname) {
            user.nickname = user.name;
          }

          return { data: user };
        }
      },
      update: {
        before: async (user) => {
          // image가 수정될 경우 userProfileImageUrl도 함께 동기화
          if (user.image) {
            user.userProfileImageUrl = user.image;
          }
          return { data: user };
        }
      }
    }
  },

  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
