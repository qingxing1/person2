# ---------- 构建阶段 ----------
FROM node:18 AS builder
WORKDIR /app

RUN npm install -g pnpm@8.15.0 --registry=https://registry.npmmirror.com

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared ./packages/shared
COPY packages/admin-frontend/package.json ./packages/admin-frontend/package.json

RUN pnpm install --frozen-lockfile --registry=https://registry.npmmirror.com

COPY packages/admin-frontend ./packages/admin-frontend
# vue-tsc 1.8 与 TypeScript 5.5+ 不兼容，容器内跳过类型检查直接 vite 构建
RUN pnpm --filter @person/shared-types --filter @person/shared-utils run build \
    && pnpm --filter @person/admin-frontend run build-only

# ---------- 运行阶段 ----------
FROM nginx:1.31.2-alpine

COPY --from=builder /app/packages/admin-frontend/dist /usr/share/nginx/html
COPY nginx/admin.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
