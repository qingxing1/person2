#!/bin/bash

# Nest-Admin Docker部署脚本 (Linux/macOS版)
set -e

echo "========================================"
echo "    Nest-Admin Docker部署脚本"
echo "========================================"
echo

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# 检查当前用户是否在docker组中
if ! groups $USER | grep -q docker; then
    echo -e "${YELLOW}[警告] 当前用户不在docker组中，可能需要sudo权限${NC}"
    echo "建议运行: sudo usermod -aG docker $USER && newgrp docker"
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

# 清理旧镜像（可选）
echo -e "${YELLOW}[询问] 是否清理旧的Docker镜像？(y/N)${NC}"
read -r cleanup
if [[ $cleanup =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}[信息] 清理旧镜像...${NC}"
    docker image prune -f
fi

# 构建并启动服务
echo -e "${BLUE}[信息] 构建并启动所有服务...${NC}"
docker compose up -d --build

# 等待服务启动
echo -e "${BLUE}[信息] 等待服务启动...${NC}"
sleep 10

# 检查服务状态
echo -e "${BLUE}[信息] 检查服务状态...${NC}"
docker compose ps

# 检查服务健康状态
echo -e "${BLUE}[信息] 检查服务健康状态...${NC}"
for i in {1..30}; do
    if curl -f http://localhost:6999/api/health &>/dev/null; then
        echo -e "${GREEN}[成功] 后端API服务正常${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}[警告] 后端API可能需要更多时间启动${NC}"
    else
        echo -n "."
        sleep 2
    fi
done

echo
echo "========================================"
echo -e "${GREEN}            部署完成!${NC}"
echo "========================================"
echo
echo "服务访问地址："
echo -e "- 管理后台前端: ${BLUE}http://localhost:9540${NC}"
echo -e "- 展示前端:     ${BLUE}http://localhost:3000${NC}"
echo -e "- 后端API:      ${BLUE}http://localhost:6999${NC}"
echo -e "- API文档:      ${BLUE}http://localhost:6999/api/docs${NC}"
echo -e "- 数据库管理:   ${BLUE}http://localhost:8088${NC}"
echo
echo "默认登录信息："
echo "- 用户名: admin"
echo "- 密码: admin"
echo
echo "常用命令："
echo "- 查看服务状态: docker compose ps"
echo "- 查看日志: docker compose logs -f [服务名]"
echo "- 停止服务: docker compose down"
echo "- 重启服务: docker compose restart [服务名]"
echo
echo -e "${GREEN}部署完成！${NC}"