# 🚀 Nest-Admin 完整Docker部署指南

## 📋 项目概述

本项目包含三个主要应用：

1. **管理后台前端 (Vue.js)** - 位于 `front/` 目录
2. **展示网站前端 (React)** - 位于 `kouzi-person/` 目录  
3. **后端API (NestJS)** - 位于 `nest-admin2/servers/` 目录

## 🛠️ 环境要求

### 服务器要求
- **操作系统**: Linux (Ubuntu 20.04+, CentOS 7+) 或 Windows Server
- **内存**: 最少 4GB RAM (推荐 8GB+)
- **磁盘**: 最少 20GB 可用空间
- **CPU**: 2核心以上

### 软件要求
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: 2.0+

## 📦 快速部署

### 方式一：一键部署脚本

#### Windows系统
```cmd
# 直接双击运行
deploy.bat

# 或在命令行中运行
.\deploy.bat
```

#### Linux/macOS系统
```bash
# 添加执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

### 方式二：手动部署

1. **克隆项目**
```bash
git clone <your-repository-url>
cd <project-directory>
```

2. **进入Docker配置目录**
```bash
cd nest-admin2
```

3. **启动所有服务**
```bash
docker compose up -d --build
```

## 🔧 详细配置说明

### 服务端口分配

| 服务 | 内部端口 | 外部端口 | 说明 |
|------|----------|----------|------|
| 管理后台前端 | 9540 | 9540 | Vue.js管理界面 |
| 展示前端 | 3000 | 3000 | React展示网站 |
| 后端API | 8080 | 6999 | NestJS API服务 |
| MySQL | 3306 | 3306 | 数据库服务 |
| Redis | 6379 | 6379 | 缓存服务 |
| Adminer | 8080 | 8088 | 数据库管理工具 |
| Nginx代理 | 80 | 80 | 反向代理 (可选) |

### 环境变量配置

1. **复制环境变量模板**
```bash
cp .env.example .env
```

2. **修改配置**
```bash
# 编辑环境变量
nano .env

# 主要配置项：
SERVER_IP=your-server-ip
MYSQL_ROOT_PASSWORD=your-strong-password
MYSQL_PASSWORD=your-mysql-password
```

### 数据库初始化

数据库会在首次启动时自动初始化，使用 `nest-admin2/db/kapok.sql` 文件。

**默认登录信息**：
- 用户名: `admin`
- 密码: `admin`

## 🌐 域名配置 (生产环境)

### 1. 修改Nginx配置

编辑 `nest-admin2/nginx/nginx.conf`：

```nginx
# 管理后台域名
server_name admin.yourdomain.com;

# 展示网站域名  
server_name www.yourdomain.com;
```

### 2. DNS配置

将以下域名指向您的服务器IP：
- `admin.yourdomain.com` → 管理后台
- `www.yourdomain.com` → 展示网站

### 3. SSL证书配置 (HTTPS)

```nginx
server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;
    
    # ... 其他配置
}
```

## 🔒 安全配置

### 1. 防火墙设置

#### Ubuntu/Debian
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

#### CentOS/RHEL
```bash
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. 数据库安全

- 修改默认密码
- 禁用远程root登录
- 创建专用数据库用户

### 3. 应用安全

- 定期更新Docker镜像
- 使用强密码
- 配置访问日志监控

## 📊 监控和维护

### 查看服务状态
```bash
# 查看所有服务
docker compose ps

# 查看特定服务日志
docker compose logs -f servers
docker compose logs -f admin-frontend
docker compose logs -f kouzi-frontend
```

### 重启服务
```bash
# 重启所有服务
docker compose restart

# 重启特定服务
docker compose restart servers
```

### 更新部署
```bash
# 拉取最新代码
git pull

# 重新构建并部署
docker compose up -d --build
```

### 备份数据
```bash
# 备份数据库
docker exec mysql-container mysqldump -u root -p kapok > backup_$(date +%Y%m%d_%H%M%S).sql

# 备份上传文件
docker run --rm -v upload-data:/data -v $(pwd):/backup ubuntu tar czf /backup/upload_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

## 🐛 故障排除

### 常见问题

#### 1. 端口被占用
```bash
# 查看端口占用
netstat -tulpn | grep :6999
# 或
ss -tulpn | grep :6999

# 停止占用端口的进程
sudo kill -9 <PID>
```

#### 2. 数据库连接失败
- 检查MySQL容器是否正常运行
- 验证数据库配置信息
- 查看数据库日志

#### 3. 前端无法访问API
- 检查网络配置
- 验证防火墙设置  
- 查看Nginx代理配置

#### 4. Docker构建失败
```bash
# 清理Docker缓存
docker system prune -a

# 重新构建特定服务
docker compose build --no-cache servers
```

### 日志查看
```bash
# 查看所有服务日志
docker compose logs

# 实时查看特定服务日志
docker compose logs -f servers

# 查看最近的错误日志
docker compose logs --tail=50 servers | grep ERROR
```

## 📈 性能优化

### 1. 资源配置
```yaml
# 在docker-compose.yaml中添加资源限制
services:
  servers:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
```

### 2. 缓存优化
- 配置Redis持久化
- 启用Nginx gzip压缩
- 设置静态文件缓存

### 3. 数据库优化
- 配置MySQL缓冲池
- 定期清理日志
- 优化查询索引

## 📞 技术支持

### 获取帮助

1. **查看日志**: 详细的错误信息通常在日志中
2. **检查配置**: 确认环境变量和网络配置
3. **资源监控**: 检查服务器内存和磁盘使用情况
4. **版本兼容**: 确认Docker和Docker Compose版本

### 联系方式

- 项目文档: [链接]
- 问题报告: [GitHub Issues]
- 技术交流: [论坛/群组]

---

## 🎉 部署成功！

访问地址：

- **管理后台**: http://your-server-ip:9540
- **展示网站**: http://your-server-ip:3000  
- **API文档**: http://your-server-ip:6999/api/docs
- **数据库管理**: http://your-server-ip:8088

默认登录：
- 用户名: `admin`
- 密码: `admin`

**重要提醒**: 
- 首次部署后请立即修改默认密码！
- 生产环境建议使用域名和HTTPS！
- 定期备份数据库和上传文件！