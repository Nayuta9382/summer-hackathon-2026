# =========================================================
# docker/prod/Dockerfile
#
# 本番用マルチステージビルド。
# next.config.ts の `output: "standalone"` を前提とする。
#
# deps    : 依存解決のみ（レイヤーキャッシュ用に分離）
# builder : npm run build を実行
# runner  : standalone 出力だけをコピーした軽量な実行イメージ
# =========================================================

ARG BASE_IMAGE=myapp-base:local

# ---------- deps ----------
FROM ${BASE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- builder ----------
FROM ${BASE_IMAGE} AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- runner ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
