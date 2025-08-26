#!/bin/bash

# 服务状态检查脚本
echo "=========================================="
echo "    服务状态检查"
echo "    服务器IP: 115.190.32.31"
echo "=========================================="
echo

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER_IP="115.190.32.31"

echo -e "${BLUE}检查Docker容器状态...${NC}"
cd nest-admin2
docker compose ps

echo
echo -e "${BLUE}检查服务端口状态...${NC}"

# 检查端口函数
check_port() {
    local port=$1
    local service=$2
    
    if netstat -tulpn 2>/dev/null | grep ":$port " > /dev/null; then
        echo -e "${GREEN}✓${NC} $service (端口 $port) - 正在运行"
    else
        echo -e "${RED}✗${NC} $service (端口 $port) - 未运行"
    fi
}

check_port 9540 "管理后台"
check_port 3000 "展示网站"
check_port 6999 "API服务"
check_port 3306 "MySQL数据库"
check_port 6379 "Redis缓存"
check_port 8088 "数据库管理"

echo
echo -e "${BLUE}检查HTTP服务状态...${NC}"

# 检查HTTP服务函数
check_http() {
    local url=$1
    local service=$2
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|302\|404"; then
        echo -e "${GREEN}✓${NC} $service - 服务正常"
    else
        echo -e "${RED}✗${NC} $service - 服务异常"
    fi
}

check_http "http://localhost:9540" "管理后台前端"
check_http "http://localhost:3000" "展示网站前端"
check_http "http://localhost:6999" "API服务"
check_http "http://localhost:8088" "数据库管理"

echo
echo -e "${BLUE}服务访问地址：${NC}"
echo "┌─────────────────────────────────────────┐"
echo "│ 管理后台: http://${SERVER_IP}:9540     │"
echo "│ 展示网站: http://${SERVER_IP}:3000     │"
echo "│ API服务:  http://${SERVER_IP}:6999     │"
echo "│ API文档:  http://${SERVER_IP}:6999/api/docs │"
echo "│ 数据库管理: http://${SERVER_IP}:8088   │"
echo "└─────────────────────────────────────────┘"

echo
echo -e "${BLUE}防火墙状态检查：${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw status
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --list-ports
else
    echo "请手动检查防火墙状态"
fi

echo
echo -e "${YELLOW}如果服务异常，请检查：${NC}"
echo "1. Docker容器是否正常运行"
echo "2. 防火墙端口是否开放"
echo "3. 查看服务日志: docker compose logs -f [服务名]"