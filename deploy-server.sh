#!/bin/bash

# Nest-Admin Docker部署脚本 - 服务器 115.190.32.31
set -e

echo "=========================================="
echo "    Nest-Admin Docker部署脚本"
echo "    服务器IP: 115.190.32.31"
echo "=========================================="
echo

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 服务器配置
SERVER_IP="115.190.32.31"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[错误] Docker未安装，请先安装Docker${NC}"
    echo "Ubuntu/Debian: sudo apt-get update && sudo apt-get install docker.io docker-compose-plugin"
    echo "CentOS/RHEL: sudo yum install docker docker-compose-plugin"
    exit 1
fi

# 检查Docker是否运行
if ! docker info &> /dev/null; then
    echo -e "${RED}[错误] Docker服务未启动${NC}"
    echo "请运行: sudo systemctl start docker"
    exit 1
fi

# 检查docker-compose是否可用
if ! docker compose version &> /dev/null; then
    echo -e "${RED}[错误] Docker Compose不可用${NC}"
    echo "请安装Docker Compose插件"
    exit 1
fi

echo -e "${GREEN}[信息] Docker环境检查通过${NC}"

# 检查环境配置文件
echo -e "${BLUE}[信息] 检查环境配置文件...${NC}"

# 检查前端配置文件
if [ ! -f "front/.env.production" ]; then
    echo -e "${YELLOW}[警告] front/.env.production 不存在，正在创建...${NC}"
    cat > front/.env.production << EOF
VITE_APP_BASE_API_URL=http://${SERVER_IP}:6999/api
VITE_APP_DOWNLOAD_URL=http://${SERVER_IP}:6999/static
VITE_APP_API_REQUEST_TIMEOUT=30000
EOF
    echo -e "${GREEN}[完成] front/.env.production 已创建${NC}"
fi

if [ ! -f "kouzi-person/.env.production" ]; then
    echo -e "${YELLOW}[警告] kouzi-person/.env.production 不存在，正在创建...${NC}"
    cat > kouzi-person/.env.production << EOF
VITE_API_BASE_URL=http://${SERVER_IP}:6999/api
EOF
    echo -e "${GREEN}[完成] kouzi-person/.env.production 已创建${NC}"
fi

# 获取脚本目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# 创建必要的目录
echo -e "${BLUE}[信息] 创建必要的目录...${NC}"
mkdir -p nest-admin2/nginx
mkdir -p logs

# 设置权限
chmod +x nest-admin2/docker-compose-restart.sh 2>/dev/null || true

echo -e "${BLUE}[信息] 开始构建Docker镜像...${NC}"

# 进入docker-compose目录
cd nest-admin2

# 停止现有容器
echo -e "${BLUE}[信息] 停止现有容器...${NC}"
docker compose down

# 清理旧镜像
echo -e "${BLUE}[信息] 清理旧镜像...${NC}"
docker image prune -f

# 构建并启动服务
echo -e "${BLUE}[信息] 构建并启动所有服务...${NC}"
docker compose up -d --build

# 等待服务启动
echo -e "${BLUE}[信息] 等待服务启动...${NC}"
sleep 15

# 检查服务状态
echo -e "${BLUE}[信息] 检查服务状态...${NC}"
docker compose ps

# 检查服务健康状态
echo -e "${BLUE}[信息] 检查服务健康状态...${NC}"
for i in {1..30}; do
    if curl -f http://localhost:6999/api/ &>/dev/null; then
        echo -e "${GREEN}[成功] 后端API服务正常${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}[警告] 后端API可能需要更多时间启动，请稍后检查${NC}"
    else
        echo -n "."
        sleep 2
    fi
done

echo
echo "=========================================="
echo -e "${GREEN}            部署完成！${NC}"
echo "=========================================="
echo
echo "服务访问地址："
echo -e "- 管理后台: ${BLUE}http://${SERVER_IP}:9540${NC}"
echo -e "- 展示网站: ${BLUE}http://${SERVER_IP}:3000${NC}"
echo -e "- API服务:   ${BLUE}http://${SERVER_IP}:6999${NC}"
echo -e "- API文档:   ${BLUE}http://${SERVER_IP}:6999/api/docs${NC}"
echo -e "- 数据库管理: ${BLUE}http://${SERVER_IP}:8088${NC}"
echo
echo "默认登录信息："
echo "- 用户名: admin"
echo "- 密码: admin"
echo
echo -e "${RED}重要提醒：${NC}"
echo "1. 请确保防火墙已开放以下端口："
echo "   - 9540 (管理后台)"
echo "   - 3000 (展示网站)"
echo "   - 6999 (API服务)"
echo "   - 8088 (数据库管理)"
echo "2. 首次登录后请立即修改默认密码！"
echo
echo "防火墙配置命令："
echo "sudo ufw allow 9540/tcp"
echo "sudo ufw allow 3000/tcp"
echo "sudo ufw allow 6999/tcp"
echo "sudo ufw allow 8088/tcp"
echo "sudo ufw enable"
echo
echo "常用命令："
echo "- 查看服务状态: docker compose ps"
echo "- 查看日志: docker compose logs -f [服务名]"
echo "- 停止服务: docker compose down"
echo "- 重启服务: docker compose restart [服务名]"
echo
echo -e "${GREEN}部署完成！现在可以访问服务了。${NC}"