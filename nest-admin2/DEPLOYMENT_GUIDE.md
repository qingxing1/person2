# 🚀 Nest-Admin2 部署指南

## 📋 环境要求

### 服务器环境
- Node.js 16.x 或更高版本
- MySQL 8.x
- Redis
- Git

### 开发工具
- npm 或 pnpm

## 🔧 部署步骤

### 1. 准备服务器环境

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 MySQL
sudo apt update
sudo apt install mysql-server

# 安装 Redis
sudo apt install redis-server

# 启动服务
sudo systemctl start mysql
sudo systemctl start redis-server
sudo systemctl enable mysql
sudo systemctl enable redis-server
```

### 2. 配置数据库

```bash
# 登录 MySQL
sudo mysql -u root -p

# 创建数据库
CREATE DATABASE kapok CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 创建用户并授权（可选）
CREATE USER 'nest_admin'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON kapok.* TO 'nest_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 导入数据库结构
mysql -u root -p kapok < db/kapok.sql
```

### 3. 克隆项目到服务器

```bash
# 克隆项目
git clone <your-repository-url> /path/to/your/project
cd /path/to/your/project

# 进入后端目录
cd servers
```

### 4. 安装依赖

```bash
# 使用 npm 安装依赖
npm install

# 或使用 pnpm（推荐）
npm install -g pnpm
pnpm install
```

### 5. 配置环境

修改配置文件 `servers/src/config/prod.yml`：

```yaml
app:
  prefix: '/api'
  port: 6999  # 您要求的端口
  file:
    domain: 'http://your-server-ip:6999'  # 替换为您服务器的实际IP

db:
  mysql:
    host: 'localhost'
    username: 'root'  # 或您创建的用户
    password: 'your_mysql_password'
    database: 'kapok'
    port: 3306

redis:
  host: 'localhost'
  port: 6379
  db: 0
```

### 6. 构建项目

```bash
# 构建生产版本
npm run build
```

### 7. 启动服务

#### 方式一：直接启动（开发/测试）
```bash
# 开发环境启动
npm run start:dev

# 生产环境启动
npm run start:prod
```

#### 方式二：使用 PM2（推荐生产环境）
```bash
# 安装 PM2
npm install -g pm2

# 创建 PM2 配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'nest-admin2',
    script: 'dist/main.js',
    env: {
      NODE_ENV: 'production'
    },
    instances: 1,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log'
  }]
}
EOF

# 启动应用
pm2 start ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save
```

#### 方式三：使用 Docker（推荐）
```bash
# 返回项目根目录
cd ..

# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f servers
```

## 🔒 安全配置

### 1. 防火墙配置
```bash
# 开放必要端口
sudo ufw allow 6999/tcp  # 后端API端口
sudo ufw allow 22/tcp    # SSH端口
sudo ufw enable
```

### 2. Nginx 反向代理（可选）
```bash
# 安装 Nginx
sudo apt install nginx

# 创建配置文件
sudo nano /etc/nginx/sites-available/nest-admin2

# 配置内容：
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名

    location /api {
        proxy_pass http://localhost:6999;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /static {
        proxy_pass http://localhost:6999;
    }
}

# 启用配置
sudo ln -s /etc/nginx/sites-available/nest-admin2 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 📊 验证部署

### 1. 检查服务状态
```bash
# 检查端口是否正常监听
sudo netstat -tlnp | grep 6999

# 测试API接口
curl http://localhost:6999/api/

# 检查Swagger文档
curl http://localhost:6999/api/docs/
```

### 2. 前端配置

在您的前端项目中，将 API 基础地址配置为：
```javascript
// 开发环境
const API_BASE_URL = 'http://localhost:6999/api'

// 生产环境（如果前端也部署在同一服务器）
const API_BASE_URL = 'http://your-server-ip:6999/api'
```

## 🐛 常见问题

### 1. 端口被占用
```bash
# 查看端口占用情况
sudo lsof -i :6999

# 杀死占用进程
sudo kill -9 <PID>
```

### 2. 数据库连接失败
- 检查 MySQL 服务是否启动
- 确认数据库用户权限
- 检查配置文件中的数据库信息

### 3. Redis 连接失败
```bash
# 检查 Redis 状态
sudo systemctl status redis-server

# 测试 Redis 连接
redis-cli ping
```

### 4. 文件上传问题
- 确保 upload 目录存在且有写权限
- 检查服务器磁盘空间

## 📝 日志查看

```bash
# PM2 日志
pm2 logs nest-admin2

# Docker 日志
docker-compose logs -f servers

# 应用日志
tail -f logs/combined.log
```

## 🔄 更新部署

```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
npm install

# 重新构建
npm run build

# 重启服务
pm2 restart nest-admin2

# 或重启 Docker
docker-compose restart servers
```

## 📞 技术支持

如果在部署过程中遇到问题，请检查：
1. 服务器系统资源（内存、磁盘空间）
2. 网络连接和防火墙设置
3. 应用日志文件
4. 数据库和 Redis 连接状态

---

🎉 恭喜！您的 Nest-Admin2 后端服务现在应该在 `http://localhost:6999` 上运行了！