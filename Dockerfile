# =====================================================
# Stage 1: base — pnpm 활성화된 Node 기반 이미지
# =====================================================
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# =====================================================
# Stage 2: deps — 의존성 설치
# =====================================================
FROM base AS deps
WORKDIR /app
COPY my-app/package.json my-app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# =====================================================
# Stage 3: builder — Next.js 빌드
# =====================================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY my-app/ .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm build

# =====================================================
# Stage 4: migrate — Drizzle 마이그레이션 실행용
#   - 전체 node_modules + 마이그레이션 파일 포함
#   - deploy.sh에서 one-off 컨테이너로 실행
# =====================================================
FROM base AS migrate
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY my-app/package.json my-app/pnpm-lock.yaml ./
COPY my-app/drizzle.config.ts ./
COPY my-app/src/db ./src/db
CMD ["pnpm", "db:migrate"]

# =====================================================
# Stage 5: runner — 경량 프로덕션 앱 이미지 (standalone)
# =====================================================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# standalone 빌드 결과물 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
