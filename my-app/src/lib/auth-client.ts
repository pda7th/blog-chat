import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields, jwtClient } from 'better-auth/client/plugins';
import type { auth } from './auth';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  plugins: [
    inferAdditionalFields<typeof auth>(), // nickname 등 additionalFields 타입 추론
    jwtClient(),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
