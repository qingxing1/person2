# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 1. 常用命令

### 开发命令
- `npm run start:dev`: 开发环境启动服务
- `npm run start:debug`: 调试模式启动服务
- `npm run build`: 构建生产版本
- `npm run format`: 代码格式化
- `npm run lint`: ESLint 代码检查与修复

### 测试命令
- `npm run test`: 运行所有单元测试
- `npm run test:watch`: 监听模式运行测试
- `npm run test:cov`: 生成测试覆盖率报告
- `npm run test:debug`: 调试模式运行测试
- `npm run test:e2e`: 运行 E2E 测试

### 生产环境命令
- `npm run start:prod`: 生产环境启动
- `npm run start:docker`: Docker 环境启动
- `npm run start:test`: 测试环境启动

## 2. 代码架构与结构

### 项目概述
这是一个基于 NestJS 框架的后端管理系统（Nest-Admin），包含完整的权限管理、内容管理和业务功能模块。

### 核心架构
```
├── src/
│   ├── main.ts                    # 应用入口
│   ├── app.module.ts              # 根模块
│   ├── config/                    # 配置文件
│   ├── common/                    # 公共模块
│   │   ├── decorators/            # 自定义装饰器
│   │   ├── enums/                 # 枚举定义
│   │   ├── guards/                # 守卫（认证、授权）
│   │   ├── libs/                  # 第三方库封装
│   │   │   ├── redis/             # Redis 模块
│   │   │   └── log4js/            # 日志模块
│   │   └── utils/                 # 工具函数
│   └── system/                    # 系统模块
│       ├── auth/                  # 认证模块
│       ├── user/                  # 用户管理
│       ├── menu/                  # 菜单管理
│       ├── role/                  # 角色管理
│       ├── perm/                  # 权限管理
│       ├── oss/                   # 文件上传
│       ├── dept/                  # 部门管理
│       ├── post/                  # 岗位管理
│       ├── blog/                  # 博客管理
│       ├── algorithm-problem/     # 算法题目
│       ├── personal/              # 个人中心
│       ├── message/               # 消息管理
│       ├── collection/            # 收藏管理
│       ├── todo/                  # 待办管理
│       └── visit-stats/           # 访问统计
```

### 关键模块说明

#### 1. 认证与权限
- `JwtAuthGuard`: JWT 认证守卫，全局启用
- `RolesGuard`: 角色权限守卫，全局启用
- `@Perm()` 装饰器: 细粒度权限控制
- `@AllowAnon()` 装饰器: 允许匿名访问

#### 2. 配置系统
- 多环境配置: dev.yml, prod.yml, test.yml, docker.yml
- 使用 `@nestjs/config` 管理
- 支持环境变量覆盖

#### 3. 日志系统
- 基于 log4js 实现
- 全局日志中间件
- 请求/响应日志
- 异常日志

#### 4. API 文档
- 自动生成 Swagger 文档
- 地址: `/api/docs` (默认前缀为 `/api`)
- 支持 JWT 认证

### 技术栈
- NestJS 10.x
- TypeScript 5.x
- TypeORM
- MySQL 8.x
- Redis 5.x
- JWT 认证
- Swagger API 文档
- Log4js 日志

## 3. 开发注意事项

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 实体类使用 `@Entity()` 装饰器
- DTO 类使用 `class-validator` 验证

### 数据库
- 自动加载实体类 (`autoLoadEntities: true`)
- 使用 Repository 模式
- 事务管理使用 `@Transaction()` 装饰器

### API 设计
- 统一响应格式，使用 `ApiResult` 装饰器
- 分页查询使用 `ReqListQuery` 工具
- 错误码使用 `CodeEnum` 枚举


# 必须注意：
- 我的操作系统是windows11
- 全程使用中文