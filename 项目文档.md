# Nest Admin 全栈项目

一个基于现代技术栈构建的完整全栈项目，包含后台管理系统、个人技术博客网站和后端API服务。

## 📋 项目概述

本项目是一个功能完整的全栈应用系统，主要包含以下三个核心模块：

- **后台管理系统** (`front/`) - 基于 Vue 3 + Element Plus 的现代化管理后台
- **个人技术网站** (`kouzi-person/`) - 基于 React + TypeScript 的个人博客和算法题库
- **后端API服务** (`nest-admin2/`) - 基于 NestJS + TypeORM 的企业级后端服务

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   管理后台       │    │   个人网站       │    │   后端服务       │
│   (Vue 3)       │    │   (React)       │    │   (NestJS)      │
│                 │    │                 │    │                 │
│ • 用户管理       │    │ • 技术博客       │    │ • RESTful API   │
│ • 权限控制       │    │ • 算法题库       │    │ • JWT 认证      │
│ • 博客管理       │    │ • 响应式设计     │    │ • MySQL 数据库  │
│ • 系统设置       │    │ • 搜索筛选       │    │ • Redis 缓存    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MySQL 数据库   │
                    │                 │
                    │ • 用户数据       │
                    │ • 博客文章       │
                    │ • 算法题目       │
                    │ • 权限配置       │
                    └─────────────────┘
```

## 🛠️ 技术栈

### 前端技术栈

#### 管理后台 (front/)
- **框架**: Vue 3.3.4 + TypeScript
- **构建工具**: Vite 4.3.9
- **UI组件**: Element Plus 2.3.7
- **样式**: Tailwind CSS 4.1.12 + SCSS
- **状态管理**: Pinia 2.1.4
- **路由**: Vue Router 4.2.2
- **HTTP客户端**: Axios 1.4.0
- **图表**: ECharts 5.4.2
- **编辑器**: md-editor-v3 5.8.4

#### 个人网站 (kouzi-person/)
- **框架**: React 18.3.1 + TypeScript
- **构建工具**: Vite 6.2.0
- **样式**: Tailwind CSS 3.4.17
- **路由**: React Router DOM 7.3.0
- **HTTP客户端**: Axios 1.11.0
- **图表**: Recharts 2.15.1 + ECharts 5.4.0
- **Markdown**: React Markdown 10.1.0
- **动画**: Framer Motion 12.9.2

### 后端技术栈

#### API服务 (nest-admin2/)
- **框架**: NestJS 10.0.3 + TypeScript
- **数据库**: MySQL 8.0 + TypeORM 0.3.17
- **缓存**: Redis + ioredis 5.3.2
- **认证**: JWT + Passport
- **文档**: Swagger 7.0.3
- **安全**: Helmet + bcryptjs
- **日志**: Log4js 6.9.1
- **限流**: express-rate-limit 6.7.0

### 数据库设计

#### 核心数据表
- **用户管理**: 用户表、角色表、权限表、部门表
- **博客系统**: 文章表、分类表、标签表、评论表
- **算法题库**: 题目表 (`algorithm_problems`)
- **系统配置**: 菜单表、字典表、日志表

## 📁 项目结构

```
项目根目录/
├── front/                      # Vue 3 管理后台
│   ├── src/
│   │   ├── api/               # API 接口定义
│   │   ├── components/        # 公共组件
│   │   ├── views/             # 页面组件
│   │   ├── router/            # 路由配置
│   │   ├── store/             # Pinia 状态管理
│   │   └── utils/             # 工具函数
│   ├── package.json
│   └── vite.config.ts
│
├── kouzi-person/               # React 个人网站
│   ├── src/
│   │   ├── components/        # React 组件
│   │   ├── pages/             # 页面组件
│   │   ├── services/          # API 服务
│   │   ├── hooks/             # 自定义 Hooks
│   │   └── utils/             # 工具函数
│   ├── package.json
│   └── vite.config.ts
│
├── nest-admin2/                # NestJS 后端服务
│   ├── servers/               # 服务端源码
│   │   ├── src/
│   │   │   ├── modules/       # 业务模块
│   │   │   ├── common/        # 公共模块
│   │   │   ├── config/        # 配置文件
│   │   │   └── main.ts        # 应用入口
│   │   ├── package.json
│   │   └── Dockerfile
│   └── package-production.json # 生产环境配置
│
├── kapok.sql                   # 数据库初始化脚本
├── .env.docker                 # Docker 环境配置
└── 项目文档.md                 # 本文档
```

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (推荐) 或 npm >= 9.0.0
- **MySQL**: >= 8.0
- **Redis**: >= 6.0 (可选，用于缓存)

### 1. 数据库初始化

```bash
# 1. 创建数据库
mysql -u root -p
CREATE DATABASE kapok CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 2. 导入数据库结构和初始数据
mysql -u root -p kapok < kapok.sql
```

### 2. 后端服务启动

```bash
# 进入后端目录
cd nest-admin2/servers

# 安装依赖
pnpm install

# 配置环境变量 (复制并修改配置文件)
cp .env.example .env

# 启动开发服务器
pnpm start:dev

# 服务将在 http://localhost:6999 启动
# API 文档: http://localhost:6999/api-docs
```

### 3. 管理后台启动

```bash
# 进入前端目录
cd front

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 应用将在 http://localhost:5173 启动
```

### 4. 个人网站启动

```bash
# 进入个人网站目录
cd kouzi-person

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 应用将在 http://localhost:3000 启动
```

## 🔧 开发配置

### 环境变量配置

#### 后端服务环境变量
```bash
# .env (nest-admin2/servers/.env)
NODE_ENV=development
PORT=6999

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=kapok

# Redis 配置 (可选)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT 配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

#### 管理后台环境变量
```bash
# front/.env.development
NODE_ENV=development
VITE_APP_BASE_API_URL=/api
VITE_APP_DOWNLOAD_URL=http://127.0.0.1:6999
VITE_APP_API_REQUEST_TIMEOUT=10000
```

#### 个人网站环境变量
```bash
# kouzi-person/.env.development
VITE_API_BASE_URL=/api
```

### 代理配置

开发环境已配置API代理，前端请求会自动转发到后端服务：

```typescript
// vite.config.ts (前端项目通用配置)
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:6999',
      changeOrigin: true,
      ws: true
    }
  }
}
```

## 📦 构建部署

### 开发环境部署

1. **启动所有服务**
```bash
# 启动后端 (终端1)
cd nest-admin2/servers && pnpm start:dev

# 启动管理后台 (终端2)  
cd front && pnpm dev

# 启动个人网站 (终端3)
cd kouzi-person && pnpm dev
```

2. **访问地址**
- 管理后台: http://localhost:5173
- 个人网站: http://localhost:3000
- API服务: http://localhost:6999
- API文档: http://localhost:6999/api-docs

### 生产环境部署

#### 方案一：传统部署

1. **构建前端项目**
```bash
# 构建管理后台
cd front
pnpm build
# 生成 dist/ 目录

# 构建个人网站
cd kouzi-person  
pnpm build
# 生成 dist/static/ 目录
```

2. **构建后端项目**
```bash
cd nest-admin2/servers
pnpm build
# 生成 dist/ 目录
```

3. **部署到服务器**
```bash
# 上传文件到服务器
scp -r front/dist/ user@server:/var/www/admin/
scp -r kouzi-person/dist/static/ user@server:/var/www/blog/
scp -r nest-admin2/servers/dist/ user@server:/app/backend/

# 安装生产依赖并启动
cd /app/backend
npm install --production
pm2 start dist/main.js --name "nest-admin-api"
```

#### 方案二：Docker 部署

1. **创建 docker-compose.yml**
```yaml
version: '3.8'

services:
  # MySQL 数据库
  mysql:
    image: mysql:8.0
    container_name: nest-admin-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: kapok
      TZ: Asia/Shanghai
    volumes:
      - mysql-data:/var/lib/mysql
      - ./kapok.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    networks:
      - app-network

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: nest-admin-redis
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"
    networks:
      - app-network

  # 后端 API 服务
  backend:
    build:
      context: ./nest-admin2/servers
      dockerfile: Dockerfile
    container_name: nest-admin-backend
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USERNAME: root
      DB_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      DB_DATABASE: kapok
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - "6999:6999"
    depends_on:
      - mysql
      - redis
    networks:
      - app-network
    volumes:
      - upload-data:/app/uploads

  # 管理后台 (Nginx)
  admin-frontend:
    image: nginx:alpine
    container_name: nest-admin-frontend
    volumes:
      - ./front/dist:/usr/share/nginx/html
      - ./nginx/admin.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  # 个人网站 (Nginx)
  blog-frontend:
    image: nginx:alpine
    container_name: kouzi-blog-frontend
    volumes:
      - ./kouzi-person/dist/static:/usr/share/nginx/html
      - ./nginx/blog.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  mysql-data:
  redis-data:
  upload-data:

networks:
  app-network:
    driver: bridge
```

2. **创建 Nginx 配置**

管理后台配置 (`nginx/admin.conf`):
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # 处理 SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend:6999/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

个人网站配置 (`nginx/blog.conf`):
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:6999/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **启动 Docker 服务**
```bash
# 设置环境变量
export MYSQL_ROOT_PASSWORD=your_secure_password

# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
```

#### 方案三：云服务部署

**阿里云/腾讯云部署建议**:

1. **ECS 服务器配置**
   - CPU: 2核心以上
   - 内存: 4GB以上
   - 存储: 40GB以上 SSD
   - 带宽: 5Mbps以上

2. **数据库服务**
   - 使用云数据库 RDS (MySQL 8.0)
   - 配置读写分离和自动备份
   - 设置安全组规则

3. **CDN 加速**
   - 静态资源托管到 OSS/COS
   - 配置 CDN 加速分发
   - 启用 HTTPS 证书

4. **负载均衡**
   - 使用 SLB/CLB 进行负载均衡
   - 配置健康检查
   - 设置自动扩缩容

## 🔐 安全配置

### 生产环境安全检查清单

- [ ] 修改默认数据库密码
- [ ] 配置强密码策略
- [ ] 启用 HTTPS (SSL/TLS)
- [ ] 配置防火墙规则
- [ ] 设置 JWT 密钥
- [ ] 启用 API 限流
- [ ] 配置 CORS 策略
- [ ] 设置文件上传限制
- [ ] 启用日志监控
- [ ] 定期数据备份

### 推荐的生产环境配置

```bash
# 后端安全配置
HELMET_ENABLED=true
RATE_LIMIT_ENABLED=true
CORS_ORIGIN=https://yourdomain.com
JWT_SECRET=your_very_secure_random_string_here
BCRYPT_ROUNDS=12

# 数据库安全
DB_SSL=true
DB_CONNECTION_LIMIT=10
DB_TIMEOUT=30000

# 文件上传限制
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx
```

## 📊 性能优化

### 前端优化

1. **代码分割**
   - 路由级别懒加载
   - 组件按需导入
   - 第三方库分离打包

2. **资源优化**
   - 图片压缩和 WebP 格式
   - CSS/JS 压缩混淆
   - Gzip 压缩传输

3. **缓存策略**
   - 浏览器缓存配置
   - CDN 缓存设置
   - Service Worker 离线缓存

### 后端优化

1. **数据库优化**
   - 索引优化
   - 查询语句优化
   - 连接池配置

2. **缓存策略**
   - Redis 缓存热点数据
   - 查询结果缓存
   - 会话缓存

3. **API 优化**
   - 响应数据压缩
   - 分页查询
   - 接口限流

## 🐛 故障排除

### 常见问题及解决方案

1. **端口冲突**
```bash
# 查看端口占用
netstat -ano | findstr :6999
# 或使用 lsof (Linux/Mac)
lsof -i :6999

# 修改端口配置
# 在对应的配置文件中修改端口号
```

2. **数据库连接失败**
```bash
# 检查数据库服务状态
systemctl status mysql  # Linux
brew services list | grep mysql  # Mac

# 检查连接配置
mysql -h localhost -u root -p kapok
```

3. **依赖安装失败**
```bash
# 清理缓存重新安装
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 或使用 pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm store prune
pnpm install
```

4. **构建失败**
```bash
# 检查 TypeScript 类型错误
npm run type-check

# 检查 ESLint 错误
npm run lint

# 清理构建缓存
rm -rf dist .vite
npm run build
```

5. **API 请求失败**
   - 检查后端服务是否启动
   - 确认 API 地址配置正确
   - 检查网络连接和防火墙
   - 查看浏览器控制台错误信息

## 📈 监控与日志

### 日志配置

后端服务使用 Log4js 进行日志管理：

```typescript
// 日志级别配置
{
  appenders: {
    console: { type: 'console' },
    file: { 
      type: 'file', 
      filename: 'logs/app.log',
      maxLogSize: 10485760, // 10MB
      backups: 5
    }
  },
  categories: {
    default: { 
      appenders: ['console', 'file'], 
      level: 'info' 
    }
  }
}
```

### 性能监控

推荐使用以下工具进行监控：

- **应用监控**: PM2 + PM2 Plus
- **服务器监控**: Prometheus + Grafana
- **错误追踪**: Sentry
- **日志分析**: ELK Stack (Elasticsearch + Logstash + Kibana)

## 🤝 贡献指南

### 开发规范

1. **代码规范**
   - 使用 TypeScript 进行类型检查
   - 遵循 ESLint 和 Prettier 规则
   - 编写单元测试和集成测试

2. **提交规范**
   - 使用语义化提交信息
   - 提交前运行代码检查
   - 编写清晰的 PR 描述

3. **分支管理**
   - `main`: 生产环境分支
   - `develop`: 开发环境分支
   - `feature/*`: 功能开发分支
   - `hotfix/*`: 紧急修复分支

### 测试策略

```bash
# 运行单元测试
npm run test

# 运行集成测试
npm run test:e2e

# 生成测试覆盖率报告
npm run test:cov
```

## 📞 技术支持

如遇到问题，可通过以下方式获取帮助：

- **邮箱**: qiao252423@163.com
- **GitHub Issues**: 在项目仓库提交 Issue
- **技术文档**: 查看各子项目的 README 文档

---

**最后更新**: 2025年1月26日  
**文档版本**: v1.0.0  
**项目版本**: v0.0.1