FROM node:20-slim AS builder
WORKDIR /app

# better-sqlite3 等原生模块需要编译工具
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx prisma generate
RUN npm run build
# 移除 dev 依赖，保留已编译的原生模块
RUN npm prune --omit=dev --legacy-peer-deps

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY prisma.config.ts ./
RUN mkdir -p uploads
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
