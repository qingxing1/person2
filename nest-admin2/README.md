# Nest-Admin2 项目文档

## 项目简介

Nest-Admin2 是一个基于 NestJS 框架开发的企业级后台管理系统，提供完整的权限管理、用户管理、部门管理等功能。项目采用前后端分离架构，后端使用 NestJS + TypeORM + MySQL，支持 Docker 容器化部署。

### 主要功能特性

- **用户管理**：用户注册、登录、权限控制、密码重置
- **角色权限**：基于 RBAC 的角色权限管理系统
- **部门管理**：组织架构管理，支持层级部门结构
- **岗位管理**：岗位信息维护和管理
- **菜单管理**：动态菜单配置，支持按钮级权限控制
- **文件管理**：文件上传、存储和访问管理
- **博客系统**：内容管理功能
- **访问统计**：系统访问数据统计
- **消息管理**：系统消息处理
- **待办事项**：任务管理功能

### 技术栈

**后端技术**
- NestJS 10.x - Node.js 企业级框架
- TypeORM 0.3.x - ORM 数据库操作
- MySQL 8.0 - 关系型数据库
- Redis - 缓存和会话存储
- JWT - 身份认证
- Swagger - API 文档
- PM2 - 进程管理
- Docker - 容器化部署

**开发工具**
- TypeScript - 类型安全的 JavaScript
- ESLint + Prettier - 代码规范
- Jest - 单元测试
- Log4js - 日志管理

## 项目结构

```
nest-admin2/
├── db/                     # 数据库脚本
│   ├── kapok.sql          # 主数据库结构
│   ├── blog_table.sql     # 博客表结构
│   ├── todo_table.sql     # 待办事项表
│   └── visit_stats_table.sql # 访问统计表
├── docs/                   # 项目文档
├── logs/                   # 日志文件目录
├── nginx/                  # Nginx 配置
├── servers/                # 后端服务代码
│   ├── src/
│   │   ├── common/        # 公共模块
│   │   ├── config/        # 配置文件
│   │   ├── system/        # 业务模块
│   │   ├── app.module.ts  # 应用主模块
│   │   └── main.ts        # 应用入口
│   ├── test/              # 测试文件
│   ├── Dockerfile         # Docker 构建文件
│   └── package.json       # 依赖配置
└── upload/                 # 文件上传目录
```

## 开发环境搭建

### 环境要求

- Node.js >= 16.0.0
- MySQL >= 8.0
- Redis >= 5.0
- pnpm (推荐) 或 npm

### 1. 克隆项目

```bash
git clone <repository-url>
cd nest-admin2
```

### 2. 安装依赖

```bash
cd servers
pnpm install
# 或使用 npm
npm install
```

### 3. 数据库配置

#### 创建数据库
```sql
CREATE DATABASE kapok CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 导入数据库结构
```bash
# 导入主数据库结构
mysql -u root -p kapok < db/kapok.sql

# 导入其他表结构（可选）
mysql -u root -p kapok < db/blog_table.sql
mysql -u root -p kapok < db/todo_table.sql
mysql -u root -p kapok < db/visit_stats_table.sql
```

### 4. 配置文件

修改 `servers/src/config/dev.yml` 配置文件：

```yaml
# 数据库配置
db:
  mysql:
    host: 'localhost'
    username: 'root'
    password: '你的数据库密码'
    database: 'kapok'
    port: 3306

# Redis 配置
redis:
  host: 'localhost'
  port: 6379
  db: 0

# JWT 配置
jwt:
  secretkey: '你的JWT密钥'
  expiresin: '1h'
```

### 5. 启动开发服务

```bash
cd servers

# 开发模式启动
pnpm run start:dev

# 或使用 npm
npm run start:dev
```

服务启动后访问：
- API 服务：http://localhost:6999/api
- Swagger 文档：http://localhost:6999/api/docs

### 6. 默认账号

- 管理员账号：`admin`
- 默认密码：`Q123456`

## 生产环境部署

### 方式一：传统部署

#### 1. 构建项目
```bash
cd servers
pnpm install --production
pnpm run build
```

#### 2. 配置生产环境
修改 `servers/src/config/prod.yml`：

```yaml
app:
  port: 8080
  file:
    domain: 'https://yourdomain.com'

db:
  mysql:
    host: '生产数据库地址'
    username: '数据库用户名'
    password: '数据库密码'
    database: 'kapok'
    logging: false
    synchronize: false

redis:
  host: '生产Redis地址'
  port: 6379
```

#### 3. 使用 PM2 启动
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
cd servers
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs nest-admin2
```

### 方式二：Docker 部署

#### 1. 构建镜像
```bash
cd servers
docker build -t nest-admin2:latest .
```

#### 2. 使用 Docker Compose（推荐）

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  # 后端服务
  servers:
    build: ./servers
    container_name: nest-admin2-backend
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=docker
    volumes:
      - ./upload:/upload
      - ./logs:/logs
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  # MySQL 数据库
  mysql:
    image: mysql:8.0
    container_name: nest-admin2-mysql
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: kapok
      MYSQL_USER: nest_user
      MYSQL_PASSWORD: nest_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./db:/docker-entrypoint-initdb.d
    ports:
      - "3306:3306"
    restart: unless-stopped

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: nest-admin2-redis
    ports:
      - "6379:6379"
    restart: unless-stopped

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    container_name: nest-admin2-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./upload:/var/www/upload
    depends_on:
      - servers
    restart: unless-stopped

volumes:
  mysql_data:
```

#### 3. 启动服务
```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f servers
```

## 开发指南

### API 接口

项目提供完整的 RESTful API，主要接口包括：

- **认证接口**：`/api/login`, `/api/register`
- **用户管理**：`/api/user/*`
- **角色管理**：`/api/role/*`
- **部门管理**：`/api/dept/*`
- **菜单管理**：`/api/menu/*`
- **文件管理**：`/api/oss/*`

详细 API 文档请访问 Swagger 文档页面。

### 权限控制

系统采用基于角色的访问控制（RBAC）：

1. **用户（User）**：系统使用者
2. **角色（Role）**：权限的集合
3. **菜单（Menu）**：系统功能点，包括页面和按钮
4. **权限（Permission）**：具体的 API 访问权限

### 文件上传

支持多种文件类型上传：
- 图片文件：jpg, jpeg, png, gif
- 文档文件：pdf, doc, docx, xls, xlsx
- 最大文件大小：50MB

### 日志管理

使用 Log4js 进行日志管理：
- **访问日志**：记录所有 API 请求
- **错误日志**：记录系统异常信息
- **应用日志**：记录业务操作日志

## 常见问题

### 1. 数据库连接失败
检查数据库配置信息，确保数据库服务正常运行。

### 2. Redis 连接失败
确保 Redis 服务启动，检查连接配置。

### 3. 文件上传失败
检查上传目录权限，确保应用有写入权限。

### 4. JWT Token 过期
检查 JWT 配置，调整过期时间设置。

## 维护和监控

### 日志监控
```bash
# 查看应用日志
tail -f logs/app-out/app.log

# 查看错误日志
tail -f logs/errors/error.log

# 查看访问日志
tail -f logs/access/access.log
```

### 性能监控
```bash
# PM2 监控
pm2 monit

# 内存使用情况
pm2 show nest-admin2
```

### 数据备份
```bash
# 数据库备份
mysqldump -u root -p kapok > backup_$(date +%Y%m%d).sql

# 文件备份
tar -czf upload_backup_$(date +%Y%m%d).tar.gz upload/
```

## 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交 Pull Request

## 许可证

本项目采用 UNLICENSED 许可证。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件至项目维护者

---

**注意**：生产环境部署前请务必修改默认密码和 JWT 密钥，确保系统安全。