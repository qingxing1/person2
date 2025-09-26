# TechPortfolio - 个人技术博客与算法题库

一个基于 React + TypeScript + Vite 构建的现代化个人技术网站，包含博客系统和算法题库功能。

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (推荐) 或 npm >= 9.0.0
- **操作系统**: Windows / macOS / Linux

### 本地开发启动

#### 1. 克隆项目

```bash
git clone <your-repository-url>
cd kouzi-person
```

#### 2. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

#### 3. 环境配置

项目包含多个环境配置文件：

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置  
- `.env.local` - 本地环境配置 (优先级最高，不会被提交到 git)

**开发环境配置** (`.env.development`):
```bash
# 开发环境配置
VITE_API_BASE_URL=/api
```

**本地特殊配置** (`.env.local` - 可选):
```bash
# 如果需要连接本地后端服务，取消注释并修改
VITE_API_BASE_URL=http://localhost:6999/api
```

#### 4. 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或者
npm run dev
```

开发服务器将在 `http://localhost:3000` 启动，并自动打开浏览器。

### 🔧 开发配置说明

#### 代理配置

开发环境已配置代理，将 `/api` 请求转发到后端服务器：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://119.180.32.31:6999', // 开发环境后端地址
      ws: true,
      changeOrigin: true
    }
  }
}
```

#### 路径别名

项目配置了路径别名 `@` 指向 `src` 目录：

```typescript
// 使用示例
import { cn } from '@/lib/utils';
import CollapsibleSidebar from '@/components/CollapsibleSidebar';
```

## 📦 构建与部署

### 本地构建

#### 1. 构建生产版本

```bash
# 清理并构建
pnpm build

# 构建步骤说明：
# 1. build:clean - 清理 dist 目录
# 2. build:client - 使用 Vite 构建前端资源
# 3. build:copy - 复制必要文件到 dist 目录
```

#### 2. 预览构建结果

```bash
# 预览构建后的应用
pnpm preview
```

预览服务器将在 `http://localhost:4173` 启动。

### 服务器部署

#### 方案一：静态文件部署 (推荐)

**适用于**: Nginx、Apache、CDN 等静态文件服务

1. **构建项目**
   ```bash
   pnpm build
   ```

2. **上传文件**
   
   将 `dist/static` 目录下的所有文件上传到服务器的 web 根目录：
   ```
   dist/static/
   ├── assets/          # 静态资源 (CSS, JS, 图片等)
   ├── index.html       # 主页面
   └── ...              # 其他静态文件
   ```

3. **Nginx 配置示例**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;  # 指向上传的静态文件目录
       index index.html;

       # 处理 SPA 路由
       location / {
           try_files $uri $uri/ /index.html;
       }

       # API 代理 (如果需要)
       location /api/ {
           proxy_pass http://your-backend-server:6999/;  # 你的后端的地址
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

4. **环境变量配置**
   
   在 `.env.production` 中配置生产环境的后端 API 地址：
   ```bash
   # .env.production
   VITE_API_BASE_URL=https://your-api-domain.com/api
   ```

#### 方案二：Docker 部署

1. **创建 Dockerfile**
   ```dockerfile
   # 构建阶段
   FROM node:18-alpine AS builder
   
   WORKDIR /app
   COPY package*.json pnpm-lock.yaml ./
   RUN npm install -g pnpm && pnpm install
   
   COPY . .
   RUN pnpm build
   
   # 生产阶段
   FROM nginx:alpine
   COPY --from=builder /app/dist/static /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **构建和运行**
   ```bash
   # 构建镜像
   docker build -t techportfolio .
   
   # 运行容器
   docker run -d -p 80:80 techportfolio
   ```

## 🛠️ 开发指南

### 项目结构

```
src/
├── components/          # 可复用组件
│   ├── CollapsibleSidebar.tsx          # 博客侧边栏
│   ├── CollapsibleAlgorithmSidebar.tsx # 算法侧边栏
│   └── ...
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── Blog.tsx        # 博客列表
│   ├── Algorithms.tsx  # 算法题库
│   └── ...
├── services/           # API 服务
│   ├── boke.ts         # 博客相关 API
│   ├── method.ts       # 算法相关 API
│   └── ...
├── config/             # 配置文件
│   ├── boke.config.ts  # 博客配置
│   └── method.config.ts # 算法配置
├── hooks/              # 自定义 Hooks
├── utils/              # 工具函数
├── lib/                # 库文件
└── types/              # 类型定义
```

### 核心功能

#### 1. 博客系统
- 📝 文章列表与详情
- 🏷️ 分类和标签筛选
- 🔍 搜索功能
- 📱 响应式设计
- 🎨 可折叠侧边栏

#### 2. 算法题库
- 💻 算法题目展示
- 📊 难度分级 (简单/中等/困难)
- 🗂️ 类别分类
- 🔍 搜索和筛选
- 📱 移动端适配

#### 3. 技术特性
- ⚡ Vite 构建工具
- 🎯 TypeScript 类型安全
- 🎨 Tailwind CSS 样式
- 📱 响应式设计
- 🌙 深色模式支持
- 🔄 SPA 路由
- 📦 组件化开发

### 开发规范

#### 1. 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 或 camelCase

#### 2. 组件开发
```typescript
// 组件示例
interface ComponentProps {
  title: string;
  onAction: (id: string) => void;
}

export default function Component({ title, onAction }: ComponentProps) {
  return (
    <div className="p-4">
      <h1>{title}</h1>
    </div>
  );
}
```

#### 3. API 调用
```typescript
// services/example.ts
import { request } from '@/utils/request';

export const getExampleList = async (params: any) => {
  return request.get('/api/example', { params });
};
```

### 常用命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm preview          # 预览构建结果

# 代码质量
pnpm lint             # 代码检查 (如果配置了)
pnpm type-check       # 类型检查 (如果配置了)

# 测试
pnpm test             # 运行测试 (如果配置了)
```

## 🔧 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 修改端口
   pnpm dev --port 3001
   ```

2. **依赖安装失败**
   ```bash
   # 清理缓存重新安装
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

3. **API 请求失败**
   - 检查 `.env` 文件中的 `VITE_API_BASE_URL` 配置
   - 确认后端服务是否正常运行
   - 检查网络连接和防火墙设置

4. **构建失败**
   ```bash
   # 清理构建缓存
   pnpm build:clean
   pnpm build
   ```

### 性能优化

1. **代码分割**: 使用 React.lazy() 进行路由级别的代码分割
2. **图片优化**: 使用 WebP 格式，添加懒加载
3. **缓存策略**: 配置适当的 HTTP 缓存头
4. **CDN 加速**: 将静态资源部署到 CDN

## 📄 许可证

[MIT License](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请通过以下方式联系：
- 邮箱: qiao252423@163.com