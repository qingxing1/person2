#!/bin/bash

# 一键部署脚本 - Nest-Admin 完整部署
# 服务器IP: 115.190.32.31
# 数据库密码: 0b3bf6af5250fc69A!

set -e

echo "=========================================="
echo "    Nest-Admin 一键部署脚本"
echo "    服务器IP: 115.190.32.31"
echo "    包含防火墙配置 + 环境配置 + Docker部署"
echo "=========================================="
echo

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER_IP="115.190.32.31"

# 步骤1: 检查系统环境
echo -e "${BLUE}步骤1/5: 检查系统环境...${NC}"

# 检查是否为root用户或有sudo权限
if [[ $EUID -eq 0 ]]; then
    SUDO=""
else
    SUDO="sudo"
    echo -e "${YELLOW}[提醒] 需要sudo权限进行系统配置${NC}"
fi

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[错误] Docker未安装${NC}"
    echo "请先安装Docker:"
    echo "Ubuntu/Debian: sudo apt-get update && sudo apt-get install docker.io docker-compose-plugin"
    echo "CentOS/RHEL: sudo yum install docker docker-compose-plugin"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${YELLOW}[信息] 启动Docker服务...${NC}"
    $SUDO systemctl start docker
    $SUDO systemctl enable docker
fi

echo -e "${GREEN}[完成] 系统环境检查通过${NC}"

# 步骤2: 配置防火墙
echo -e "${BLUE}步骤2/5: 配置防火墙端口...${NC}"

if command -v ufw &> /dev/null; then
    echo -e "${BLUE}[信息] 使用ufw配置防火墙${NC}"
    $SUDO ufw allow 22/tcp    # SSH
    $SUDO ufw allow 9540/tcp  # 管理后台
    $SUDO ufw allow 3000/tcp  # 展示网站
    $SUDO ufw allow 6999/tcp  # API服务
    $SUDO ufw allow 8088/tcp  # 数据库管理
    $SUDO ufw allow 80/tcp    # HTTP
    $SUDO ufw allow 443/tcp   # HTTPS
    echo "y" | $SUDO ufw enable || true

elif command -v firewall-cmd &> /dev/null; then
    echo -e "${BLUE}[信息] 使用firewall-cmd配置防火墙${NC}"
    $SUDO firewall-cmd --permanent --add-port=22/tcp
    $SUDO firewall-cmd --permanent --add-port=9540/tcp
    $SUDO firewall-cmd --permanent --add-port=3000/tcp
    $SUDO firewall-cmd --permanent --add-port=6999/tcp
    $SUDO firewall-cmd --permanent --add-port=8088/tcp
    $SUDO firewall-cmd --permanent --add-port=80/tcp
    $SUDO firewall-cmd --permanent --add-port=443/tcp
    $SUDO firewall-cmd --reload

else
    echo -e "${YELLOW}[警告] 未检测到防火墙工具，请手动开放端口${NC}"
fi

echo -e "${GREEN}[完成] 防火墙配置完成${NC}"

# 步骤3: 创建环境配置文件
echo -e "${BLUE}步骤3/5: 创建环境配置文件...${NC}"

# Vue前端配置
if [ ! -f "front/.env.production" ]; then
    cat > front/.env.production << EOF
VITE_APP_BASE_API_URL=http://${SERVER_IP}:6999/api
VITE_APP_DOWNLOAD_URL=http://${SERVER_IP}:6999/static
VITE_APP_API_REQUEST_TIMEOUT=30000
EOF
    echo -e "${GREEN}[完成] front/.env.production 已创建${NC}"
fi

# React前端配置
if [ ! -f "kouzi-person/.env.production" ]; then
    cat > kouzi-person/.env.production << EOF
VITE_API_BASE_URL=http://${SERVER_IP}:6999/api
EOF
    echo -e "${GREEN}[完成] kouzi-person/.env.production 已创建${NC}"
fi

echo -e "${GREEN}[完成] 环境配置文件创建完成${NC}"

# 步骤4: 准备Docker环境
echo -e "${BLUE}步骤4/5: 准备Docker环境...${NC}"

# 创建必要目录
mkdir -p nest-admin2/nginx
mkdir -p logs

# 停止现有容器
cd nest-admin2
docker compose down 2>/dev/null || true

# 清理旧镜像
docker image prune -f

echo -e "${GREEN}[完成] Docker环境准备完成${NC}"

# 步骤5: 构建并启动服务
echo -e "${BLUE}步骤5/5: 构建并启动所有服务...${NC}"

# 构建并启动
docker compose up -d --build

echo -e "${BLUE}[信息] 等待服务启动...${NC}"
sleep 20

# 检查服务状态
echo -e "${BLUE}[信息] 检查服务状态...${NC}"
docker compose ps

# 等待API服务就绪
echo -e "${BLUE}[信息] 检查API服务健康状态...${NC}"
for i in {1..60}; do
    if curl -f http://localhost:6999/ &>/dev/null; then
        echo -e "${GREEN}[成功] API服务已就绪${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${YELLOW}[警告] API服务启动时间较长，请稍后检查${NC}"
    else
        echo -n "."
        sleep 3
    fi
done

echo
echo "=========================================="
echo -e "${GREEN}    🎉 部署完成！🎉${NC}"
echo "=========================================="
echo
echo -e "${YELLOW}服务访问地址：${NC}"
echo -e "┌─────────────────────────────────────────┐"
echo -e "│ 管理后台: ${BLUE}http://${SERVER_IP}:9540${NC}     │"
echo -e "│ 展示网站: ${BLUE}http://${SERVER_IP}:3000${NC}     │"
echo -e "│ API服务:  ${BLUE}http://${SERVER_IP}:6999${NC}     │"
echo -e "│ API文档:  ${BLUE}http://${SERVER_IP}:6999/api/docs${NC} │"
echo -e "│ 数据库管理: ${BLUE}http://${SERVER_IP}:8088${NC}   │"
echo -e "└─────────────────────────────────────────┘"
echo
echo -e "${YELLOW}默认登录信息：${NC}"
echo -e "用户名: ${GREEN}admin${NC}"
echo -e "密码:   ${GREEN}admin${NC}"
echo
echo -e "${RED}🚨 重要提醒：${NC}"
echo "1. ${RED}请立即登录管理后台修改默认密码！${NC}"
echo "2. 数据库密码已设置为您提供的密码"
echo "3. 所有服务已启动并可以访问"
echo
echo -e "${BLUE}常用管理命令：${NC}"
echo "- 查看服务状态: docker compose ps"
echo "- 查看服务日志: docker compose logs -f [服务名]"
echo "- 重启所有服务: docker compose restart"
echo "- 停止所有服务: docker compose down"
echo
echo -e "${GREEN}部署完成！现在可以访问您的应用了！${NC}"