#!/bin/bash

# 快速配置脚本 - 部署前配置设置
set -e

echo "=========================================="
echo "    部署前快速配置工具"
echo "=========================================="
echo

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取服务器IP
read -p "请输入您的服务器IP地址 (例如: 192.168.1.100): " SERVER_IP

# 验证IP地址格式（简单验证）
if [[ -z "$SERVER_IP" ]]; then
    echo -e "${RED}[错误] IP地址不能为空！${NC}"
    exit 1
fi

# 验证IP格式
if ! [[ $SERVER_IP =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
    echo -e "${YELLOW}[警告] IP地址格式可能不正确，但将继续配置...${NC}"
fi

echo
echo -e "${BLUE}正在为以下服务器配置: $SERVER_IP${NC}"
echo

# 创建front前端环境配置
echo -e "${BLUE}[信息] 创建Vue管理后台环境配置...${NC}"
if [ ! -d "front" ]; then
    echo -e "${YELLOW}[警告] front目录不存在，跳过Vue前端配置${NC}"
else
    cat > front/.env.production << EOF
VITE_APP_BASE_API_URL=http://${SERVER_IP}:6999/api
VITE_APP_DOWNLOAD_URL=http://${SERVER_IP}:6999/static
VITE_APP_API_REQUEST_TIMEOUT=30000
EOF
    echo -e "${GREEN}[完成] front/.env.production 已创建${NC}"
fi

# 创建kouzi-person前端环境配置
echo -e "${BLUE}[信息] 创建React展示前端环境配置...${NC}"
if [ ! -d "kouzi-person" ]; then
    echo -e "${YELLOW}[警告] kouzi-person目录不存在，跳过React前端配置${NC}"
else
    cat > kouzi-person/.env.production << EOF
VITE_API_BASE_URL=http://${SERVER_IP}:6999/api
EOF
    echo -e "${GREEN}[完成] kouzi-person/.env.production 已创建${NC}"
fi

# 创建生产环境配置
echo -e "${BLUE}[信息] 创建生产环境配置文件...${NC}"
cat > .env.production << EOF
# 生产环境配置
SERVER_IP=${SERVER_IP}
ADMIN_FRONTEND_URL=http://${SERVER_IP}:9540
KOUZI_FRONTEND_URL=http://${SERVER_IP}:3000
BACKEND_API_URL=http://${SERVER_IP}:6999
EOF
echo -e "${GREEN}[完成] .env.production 已创建${NC}"

# 检查Docker配置
echo -e "${BLUE}[信息] 验证Docker配置...${NC}"
if [ -f "nest-admin2/docker-compose.yaml" ]; then
    echo -e "${GREEN}[完成] Docker Compose配置文件存在${NC}"
else
    echo -e "${RED}[错误] Docker Compose配置文件不存在${NC}"
fi

echo
echo "=========================================="
echo -e "${GREEN}            配置完成！${NC}"
echo "=========================================="
echo
echo "服务访问地址："
echo -e "- 管理后台: ${BLUE}http://${SERVER_IP}:9540${NC}"
echo -e "- 展示网站: ${BLUE}http://${SERVER_IP}:3000${NC}"
echo -e "- API服务:   ${BLUE}http://${SERVER_IP}:6999${NC}"
echo -e "- 数据库管理: ${BLUE}http://${SERVER_IP}:8088${NC}"
echo
echo "下一步操作："
echo "1. 确保服务器防火墙开放端口: 9540, 3000, 6999, 8088"
echo "2. 运行部署脚本: ./deploy.sh"
echo "3. 等待服务启动完成"
echo "4. 访问管理后台修改默认密码"
echo
echo -e "${YELLOW}防火墙配置命令：${NC}"
echo "# Ubuntu/Debian:"
echo "sudo ufw allow 9540/tcp"
echo "sudo ufw allow 3000/tcp"
echo "sudo ufw allow 6999/tcp"
echo "sudo ufw allow 8088/tcp"
echo "sudo ufw enable"
echo
echo "# CentOS/RHEL:"
echo "sudo firewall-cmd --permanent --add-port=9540/tcp"
echo "sudo firewall-cmd --permanent --add-port=3000/tcp"
echo "sudo firewall-cmd --permanent --add-port=6999/tcp"
echo "sudo firewall-cmd --permanent --add-port=8088/tcp"
echo "sudo firewall-cmd --reload"
echo
echo -e "${GREEN}配置完成！现在可以运行部署脚本了。${NC}"