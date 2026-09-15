# ---------- 构建阶段 ----------
FROM node:18 AS builder
WORKDIR /app

# 安装 pnpm（走淘宝镜像）
RUN npm install -g pnpm@8.15.0 --registry=https://registry.npmmirror.com

# pnpm 镜像源 + 网络容错配置
RUN pnpm config set registry https://registry.npmmirror.com \
 && pnpm config set fetch-retries 5 \
 && pnpm config set fetch-retry-mintimeout 15000 \
 && pnpm config set fetch-retry-maxtimeout 120000 \
 && pnpm config set fetch-timeout 300000

# 先拷贝依赖清单，充分利用构建缓存
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared ./packages/shared
COPY packages/backend/package.json ./packages/backend/package.json

# 安装依赖
RUN pnpm install --frozen-lockfile

# 拷贝源码并构建（含 workspace 共享包）
COPY packages/backend ./packages/backend
RUN pnpm --filter @person/backend... run build

# 生成仅含生产依赖的可部署目录
RUN pnpm deploy --filter @person/backend --prod /prod

# ---------- 运行阶段 ----------
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=docker \
    TZ=Asia/Shanghai

RUN mkdir -p /app/uploads /app/logs \
 && apk add --no-cache tzdata \
 && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

COPY --from=builder /prod/node_modules ./node_modules
COPY --from=builder /prod/package.json ./package.json
COPY --from=builder /app/packages/backend/dist ./dist

EXPOSE 6999
CMD ["node", "dist/main"]