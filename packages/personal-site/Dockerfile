# ---------- 构建阶段 ----------
FROM node:18 AS builder
WORKDIR /app

RUN npm install -g pnpm@8.15.0 --registry=https://registry.npmmirror.com

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared ./packages/shared
COPY packages/personal-site/package.json ./packages/personal-site/package.json

RUN pnpm install --frozen-lockfile --registry=https://registry.npmmirror.com

COPY packages/personal-site ./packages/personal-site
# 注意：不使用根 package.json 中的 build（含 Windows 专用命令），直接执行 vite 构建
RUN pnpm --filter @person/personal-site... run build:client

# ---------- 运行阶段 ----------
FROM nginx:1.31.2-alpine

COPY --from=builder /app/packages/personal-site/dist/static /usr/share/nginx/html
COPY nginx/blog.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
