# 🔧 部署前必要配置修改清单

## ⚠️ 重要提醒
在将项目部署到服务器之前，必须修改以下配置以确保各服务能够正确通信！

---

## 📋 必须修改的配置项

### 1. **前端API地址配置**

#### A. Vue.js管理后台 (`front/` 目录)

**需要创建环境变量文件**：

在 `front/` 目录下创建 `.env.production` 文件：
```bash
# 生产环境配置
VITE_APP_BASE_API_URL=http://你的服务器IP:6999/api
VITE_APP_DOWNLOAD_URL=http://你的服务器IP:6999/static
VITE_APP_API_REQUEST_TIMEOUT=30000
```

**或者修改 `front/vite.config.ts`**：
在第65-70行的 server.proxy 配置下方添加生产环境配置：
```typescript
// 在 vite.config.ts 中添加
define: {
  __PROD_API_BASE_URL__: JSON.stringify('http://你的服务器IP:6999')
}
```

#### B. React展示前端 (`kouzi-person/` 目录)

**创建环境变量文件**：

在 `kouzi-person/` 目录下创建 `.env.production` 文件：
```bash
# 生产环境API地址
VITE_API_BASE_URL=http://你的服务器IP:6999/api
```

### 2. **后端数据库连接配置**

#### A. Docker环境配置 (`nest-admin2/servers/src/config/docker.yml`)

✅ **已正确配置** - 无需修改
```yaml
db:
  mysql:
    host: 'mysql'  # Docker容器内服务名
    username: 'root'
    password: 'root'
    database: 'kapok'
    port: 3306
```

#### B. Redis配置检查

需要检查 `nest-admin2/servers/src/config/docker.yml` 中的Redis配置：
```yaml
redis:
  host: 'redis'  # Docker容器内服务名
  port: 6379
  db: 0
  keyPrefix: 'nest_admin_'
```

### 3. **容器端口映射检查**

#### A. docker-compose.yaml 端口配置

✅ **已正确配置** - 当前端口映射：
- 管理后台前端: `9540:9540`
- 展示前端: `3000:3000`
- 后端API: `6999:8080`
- MySQL: `3306:3306`
- Redis: `6379:6379`

#### B. 如需修改端口，在 `nest-admin2/docker-compose.yaml` 中调整：
```yaml
services:
  admin-frontend:
    ports:
      - "你想要的端口:9540"
  
  kouzi-frontend:
    ports:
      - "你想要的端口:3000"
      
  servers:
    ports:
      - "你想要的端口:8080"
```

### 4. **Nginx配置修改**

#### A. 前端Nginx配置

**front/nginx.conf** - ✅ 已正确配置
**kouzi-person/nginx.conf** - ✅ 已正确配置

#### B. 反向代理配置 (`nest-admin2/nginx/nginx.conf`)

需要根据实际域名修改：
```nginx
# 第39行和第60行，修改域名
server_name admin.你的域名.com;  # 管理后台域名
server_name www.你的域名.com;    # 展示网站域名
```

### 5. **防火墙和安全配置**

确保服务器防火墙开放以下端口：
```bash
# Ubuntu/Debian
sudo ufw allow 9540/tcp  # 管理后台
sudo ufw allow 3000/tcp  # 展示前端
sudo ufw allow 6999/tcp  # API服务
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS (如果使用)

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=9540/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=6999/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload
```

---

## 🚀 快速配置脚本

为了简化配置过程，可以使用以下命令快速创建配置文件：

### Windows 快速配置脚本：
```cmd
@echo off
set /p SERVER_IP="请输入您的服务器IP地址: "

echo 创建Vue前端环境配置...
echo VITE_APP_BASE_API_URL=http://%SERVER_IP%:6999/api > front\.env.production
echo VITE_APP_DOWNLOAD_URL=http://%SERVER_IP%:6999/static >> front\.env.production
echo VITE_APP_API_REQUEST_TIMEOUT=30000 >> front\.env.production

echo 创建React前端环境配置...
echo VITE_API_BASE_URL=http://%SERVER_IP%:6999/api > kouzi-person\.env.production

echo 配置完成！
echo 管理后台将通过 http://%SERVER_IP%:9540 访问
echo 展示网站将通过 http://%SERVER_IP%:3000 访问
echo API服务将通过 http://%SERVER_IP%:6999 访问
pause
```

### Linux/macOS 快速配置脚本：
```bash
#!/bin/bash
read -p "请输入您的服务器IP地址: " SERVER_IP

echo "创建Vue前端环境配置..."
cat > front/.env.production << EOF
VITE_APP_BASE_API_URL=http://${SERVER_IP}:6999/api
VITE_APP_DOWNLOAD_URL=http://${SERVER_IP}:6999/static
VITE_APP_API_REQUEST_TIMEOUT=30000
EOF

echo "创建React前端环境配置..."
cat > kouzi-person/.env.production << EOF
VITE_API_BASE_URL=http://${SERVER_IP}:6999/api
EOF

echo "配置完成！"
echo "管理后台将通过 http://${SERVER_IP}:9540 访问"
echo "展示网站将通过 http://${SERVER_IP}:3000 访问"
echo "API服务将通过 http://${SERVER_IP}:6999 访问"
```

---

## ✅ 配置检查清单

部署前请确认以下项目：

- [ ] **前端环境变量文件已创建**
  - [ ] `front/.env.production` 文件存在
  - [ ] `kouzi-person/.env.production` 文件存在
  - [ ] API地址指向正确的服务器IP和端口

- [ ] **后端配置检查**
  - [ ] `nest-admin2/servers/src/config/docker.yml` 数据库配置正确
  - [ ] Redis配置正确

- [ ] **端口配置确认**
  - [ ] docker-compose.yaml 端口映射正确
  - [ ] 服务器防火墙已开放相应端口

- [ ] **域名配置（如果使用）**
  - [ ] Nginx反向代理配置已修改域名
  - [ ] DNS已指向服务器IP

- [ ] **安全配置**
  - [ ] 默认密码已计划修改
  - [ ] 防火墙规则已配置

---

## 🔄 部署流程

配置完成后的部署流程：

1. **上传代码到服务器**
2. **运行配置验证脚本**：`./verify-config.sh`
3. **执行部署脚本**：`./deploy.sh`
4. **验证服务**：访问各个服务地址确认正常运行
5. **修改默认密码**：登录管理后台修改admin用户密码

---

## 📞 故障排除

### 常见问题：

1. **前端无法访问API**
   - 检查 `.env.production` 文件中的API地址
   - 确认服务器防火墙已开放6999端口
   - 检查后端服务是否正常启动

2. **数据库连接失败**
   - 检查MySQL容器是否正常启动
   - 验证数据库初始化脚本是否执行成功

3. **Redis连接失败**
   - 检查Redis容器状态
   - 验证Redis配置文件

---

## 🎯 关键提醒

⚠️ **最重要的配置**：
1. 创建前端 `.env.production` 文件
2. 配置正确的服务器IP地址
3. 确保防火墙开放必要端口

完成这些配置后，就可以安全地部署到服务器了！