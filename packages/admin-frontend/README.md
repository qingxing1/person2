# Nest Admin Client

一个基于 Vue 3 + TypeScript + Element Plus 的现代化后台管理系统前端项目。

## 项目简介

本项目是一个功能完整的后台管理系统前端应用，采用最新的前端技术栈构建，提供了用户管理、权限控制、博客管理、算法集合等核心功能模块。系统具有良好的用户体验和完善的权限管理机制。

## 技术栈

### 核心框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - JavaScript 的超集，提供静态类型检查
- **Vite** - 下一代前端构建工具

### UI 组件库
- **Element Plus** - 基于 Vue 3 的桌面端组件库
- **Tailwind CSS** - 实用优先的 CSS 框架

### 状态管理与路由
- **Pinia** - Vue 3 官方推荐的状态管理库
- **Vue Router** - Vue.js 官方路由管理器

### 工具库
- **Axios** - HTTP 客户端
- **Day.js** - 轻量级日期处理库
- **ECharts** - 数据可视化图表库
- **VueUse** - Vue 组合式 API 工具集
- **Marked** - Markdown 解析器

## 功能特性

### 🏠 仪表盘
- 数据概览和统计图表
- 系统状态监控

### 📝 博客管理
- 博客文章的增删改查
- Markdown 编辑器支持
- 文章分类和标签管理

### 🧮 算法集合
- 算法展示和管理
- 代码示例和说明

### 👥 权限管理
- **用户管理** - 用户信息维护和状态管理
- **部门管理** - 组织架构管理
- **岗位管理** - 职位信息管理
- **角色管理** - 角色权限分配

### ⚙️ 系统设置
- **资源管理** - 菜单和权限资源配置
- **文件列表** - 文件上传和管理

### 👤 个人中心
- **信息设置** - 个人资料管理
- **信息留言** - 消息通知管理
- **收藏管理** - 个人收藏内容

### 🌐 前端展示
- 跳转到前台展示页面

## 项目结构

```
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   ├── assets/            # 静态资源
│   ├── common/            # 公共模块
│   ├── components/        # 公共组件
│   ├── config/            # 配置文件
│   ├── directive/         # 自定义指令
│   ├── hooks/             # 组合式 API
│   ├── icons/             # 图标资源
│   ├── layout/            # 布局组件
│   ├── plugins/           # 插件
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── styles/            # 样式文件
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   ├── App.vue            # 根组件
│   ├── main.ts            # 入口文件
│   └── perm.ts            # 权限控制
├── .env.development       # 开发环境配置
├── .env.production        # 生产环境配置
├── .env.test             # 测试环境配置
├── package.json          # 项目依赖
├── vite.config.ts        # Vite 配置
└── README.md             # 项目说明
```

## 开发环境搭建

### 环境要求

- **Node.js** >= 16.0.0
- **pnpm** >= 7.0.0 (推荐) 或 npm >= 8.0.0

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 环境配置

项目使用环境变量进行配置，主要配置文件：

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置  
- `.env.test` - 测试环境配置

#### 开发环境配置 (.env.development)
```bash
NODE_ENV = development
VITE_APP_BASE_API_URL = /api
VITE_APP_DOWNLOAD_URL = http://127.0.0.1:8081
VITE_APP_API_REQUEST_TIMEOUT = 10000
```

#### 生产环境配置 (.env.production)
```bash
NODE_ENV = production
VITE_APP_BASE_API_URL = http://115.190.32.31:6999/api
VITE_APP_DOWNLOAD_URL = http://115.190.32.31:6999/api
VITE_APP_API_REQUEST_TIMEOUT = 10000
```

### 开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动，并自动打开浏览器。

### 代码规范

项目集成了 ESLint 和 Prettier 进行代码规范检查：

```bash
# 代码格式检查和修复
pnpm lint

# 或
npm run lint
```

### 类型检查

```bash
# TypeScript 类型检查
pnpm type-check

# 或
npm run type-check
```

## 构建部署

### 构建生产版本

```bash
# 构建生产环境
pnpm build

# 或
npm run build
```

构建完成后，生成的文件将在 `dist/` 目录中。

### 构建优化

项目已配置以下构建优化：

- **代码分割** - 自动分离 Vue、Element Plus 等第三方库
- **资源压缩** - 生产环境自动启用 Gzip 压缩
- **Tree Shaking** - 自动移除未使用的代码
- **代码混淆** - 生产环境移除 console 和 debugger

### 预览构建结果

```bash
# 预览生产构建
pnpm preview

# 或
npm run preview
```

### 部署方式

#### 1. 静态文件部署

将 `dist/` 目录中的文件部署到任何静态文件服务器：

- **Nginx**
- **Apache**
- **CDN**
- **对象存储** (如阿里云 OSS、腾讯云 COS)

#### 2. Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # 处理 Vue Router 的 history 模式
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 3. Docker 部署

创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## API 接口

### 接口配置

- **开发环境**: 通过 Vite 代理到 `http://115.190.32.31:6999`
- **生产环境**: 直接请求 `http://115.190.32.31:6999/api`

### 请求拦截

项目已配置 Axios 拦截器处理：

- 请求头自动添加 Token
- 响应错误统一处理
- 请求超时设置 (10秒)

## 开发指南

### 添加新页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 如需权限控制，在路由 meta 中配置相应权限

### 添加新组件

1. 公共组件放在 `src/components/`
2. 页面专用组件放在对应页面目录下
3. 使用 TypeScript 编写，确保类型安全

### 状态管理

使用 Pinia 进行状态管理，store 文件放在 `src/store/` 目录。

### 样式开发

- 使用 SCSS 预处理器
- 集成 Tailwind CSS 实用类
- 全局样式在 `src/styles/` 目录

## 常见问题

### 1. 开发服务器启动失败

检查 Node.js 版本是否 >= 16.0.0，确保依赖安装完整。

### 2. API 请求失败

检查后端服务是否启动，确认 API 地址配置正确。

### 3. 构建失败

检查 TypeScript 类型错误，运行 `pnpm type-check` 进行类型检查。

### 4. 路由跳转异常

确认路由配置正确，检查权限设置是否正确。

---

**注意**: 请确保在生产环境中修改默认的 API 地址和相关配置，以确保系统安全性。