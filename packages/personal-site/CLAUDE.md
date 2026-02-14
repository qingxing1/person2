# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述
一个基于 React + TypeScript + Vite 构建的现代化个人技术网站，包含博客系统和算法题库功能。

## 核心技术栈
- React 18.3.1 + TypeScript 5.7.2
- Vite 6.2.0 (构建工具)
- Tailwind CSS 3.4.17 (样式)
- React Router DOM 7.3.0 (路由)
- MD Editor RT 5.8.4 (Markdown 编辑器)
- React Markdown 10.1.0 (Markdown 渲染)
- React Syntax Highlighter 15.5.0 (代码高亮)
- 其他: Axios、Framer Motion、Sonner Toast、Recharts

## 常用命令

### 开发相关
```bash
# 安装依赖
pnpm install
npm install

# 启动开发服务器
pnpm dev              # 默认端口 3000
npm run dev

# 构建生产版本
pnpm build            # 包含清理、构建和文件复制步骤
npm run build

# 预览构建结果
pnpm preview          # 默认端口 4173
npm run preview
```

### 代码质量与测试
```bash
# 类型检查
npx tsc --noEmit

# 运行测试
pnpm test             # 需要先在 package.json 中配置
npm run test

# 运行特定测试文件
pnpm test src/components/__tests__/CollapsibleSidebar.test.tsx
npm run test src/components/__tests__/CollapsibleSidebar.test.tsx
```

## 项目结构
```
src/
├── components/          # 可复用组件
│   ├── CollapsibleSidebar.tsx          # 博客侧边栏
│   ├── CollapsibleAlgorithmSidebar.tsx # 算法侧边栏
│   ├── CodeBlock.tsx                   # 代码块组件
│   └── ...
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── Blog.tsx        # 博客列表
│   ├── Algorithms.tsx  # 算法题库
│   ├── About.tsx       # 关于页面
│   └── ...
├── services/           # API 服务层
│   ├── boke.ts         # 博客相关 API
│   ├── method.ts       # 算法相关 API
│   └── ...
├── config/             # 配置文件
│   ├── boke.config.ts  # 博客配置
│   └── method.config.ts # 算法配置
├── hooks/              # 自定义 Hooks
│   ├── useSearch.ts    # 搜索 Hook
│   └── useTheme.ts     # 主题 Hook
├── utils/              # 工具函数
│   ├── request.ts      # Axios 封装
│   └── ...
├── lib/                # 库文件
│   ├── types.ts        # 类型定义
│   └── utils.ts        # 通用工具
└── main.tsx           # 应用入口
```

## 核心架构与设计

### 1. 页面路由
使用 React Router DOM 7.3.0 实现 SPA 路由，主要路由配置在 `src/App.tsx`：
- `/` - 首页
- `/blog` - 博客列表
- `/blog/:id` - 博客详情
- `/algorithms` - 算法题库
- `/algorithms/:id` - 算法详情
- `/about` - 关于页面
- `/contact` - 联系页面
- `/search` - 搜索结果

### 2. API 调用
- 统一封装在 `src/utils/request.ts` 中
- 各业务模块的 API 定义在 `src/services/` 目录下
- 使用 Axios 作为 HTTP 客户端
- 支持环境变量配置 API 基础路径
- API 代理已配置在 `vite.config.ts` 中，开发环境将 `/api` 请求转发到后端

### 3. 组件设计
- 采用功能化组件 + Hooks 模式
- 核心组件:
  - `CollapsibleSidebar.tsx` - 博客侧边栏
  - `CollapsibleAlgorithmSidebar.tsx` - 算法侧边栏
  - `CodeBlock.tsx` - 代码块组件 (支持语法高亮和多种语言)
  - `Navbar.tsx` - 顶部导航栏 (包含搜索功能)
  - `Footer.tsx` - 页脚
- Markdown 编辑器:
  - 使用 `md-editor-rt` 富文本编辑器
  - 支持多种语言高亮
  - 支持 Markdown 实时预览
  - 可用于博客文章和算法题解编辑
- 支持响应式设计和移动端适配

### 4. 状态管理
- 主要使用 React 内置的 Context 和 Hooks
- `AuthContext` - 认证状态管理 (位于 `src/contexts/authContext.ts`):
  - `isAuthenticated`: 是否认证
  - `setIsAuthenticated`: 设置认证状态
  - `logout`: 登出函数
- `useSearch` - 搜索状态管理 Hook (位于 `src/hooks/useSearch.ts`)
- `useTheme` - 主题切换 Hook (位于 `src/hooks/useTheme.ts`):
  - 支持 light/dark 模式
  - 自动检测系统主题偏好
  - 主题状态持久化到 localStorage

### 5. 配置系统
- `src/config/boke.config.ts` - 博客相关配置 (分类、标签等)
- `src/config/method.config.ts` - 算法相关配置
- 环境配置通过 `.env` 文件实现

## 配置文件
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
- `.env.local` - 本地环境配置 (优先级最高)
- 核心环境变量: `VITE_API_BASE_URL` - API 基础地址

## 构建流程
1. `build:clean` - 清理 `dist` 目录
2. `build:client` - 使用 Vite 构建前端资源
3. `build:copy` - 复制必要文件到 `dist` 目录
4. 构建产物位于 `dist/static/` 目录

## 测试
- 使用 Vitest + React Testing Library 进行测试
- 测试文件位于 `src/components/__tests__/` 目录下
- 支持单元测试和集成测试

## 注意事项
- 路径别名 `@` 指向 `src` 目录
- 代码采用 TypeScript 编写，严格类型检查
- 支持深色/浅色模式切换
- 响应式设计适配移动端和桌面端
- 使用中文思考和回答
- 开发场景为windows11操作系统