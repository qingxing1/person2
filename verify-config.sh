#!/bin/bash

# Docker配置验证脚本
echo "=========================================="
echo "    Docker配置验证"
echo "=========================================="
echo

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 验证计数器
passed=0
failed=0

# 验证函数
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description: $file"
        ((passed++))
    else
        echo -e "${RED}✗${NC} $description: $file (文件不存在)"
        ((failed++))
    fi
}

check_directory() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $description: $dir"
        ((passed++))
    else
        echo -e "${YELLOW}!${NC} $description: $dir (目录不存在，将自动创建)"
        mkdir -p "$dir"
        if [ -d "$dir" ]; then
            echo -e "${GREEN}✓${NC} 目录创建成功: $dir"
            ((passed++))
        else
            echo -e "${RED}✗${NC} 目录创建失败: $dir"
            ((failed++))
        fi
    fi
}

# 获取脚本目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

echo "验证项目结构..."
echo

# 验证主要目录结构
check_directory "front" "Vue.js前端目录"
check_directory "kouzi-person" "React前端目录"
check_directory "nest-admin2" "后端项目目录"
check_directory "nest-admin2/servers" "NestJS服务目录"
check_directory "nest-admin2/db" "数据库脚本目录"

echo

# 验证Dockerfile
echo "验证Dockerfile..."
check_file "front/Dockerfile" "Vue.js前端Dockerfile"
check_file "kouzi-person/Dockerfile" "React前端Dockerfile"
check_file "nest-admin2/servers/Dockerfile" "后端Dockerfile"

echo

# 验证配置文件
echo "验证配置文件..."
check_file "nest-admin2/docker-compose.yaml" "Docker Compose配置"
check_file "front/nginx.conf" "Vue.js前端Nginx配置"
check_file "kouzi-person/nginx.conf" "React前端Nginx配置"
check_file "nest-admin2/nginx/nginx.conf" "反向代理Nginx配置"

echo

# 验证数据库文件
echo "验证数据库文件..."
check_file "nest-admin2/db/kapok.sql" "数据库初始化脚本"
check_file "kapok.sql" "数据库备份文件"

echo

# 验证包管理文件
echo "验证包管理文件..."
check_file "front/package.json" "Vue.js前端包配置"
check_file "kouzi-person/package.json" "React前端包配置"
check_file "nest-admin2/servers/package.json" "后端包配置"

echo

# 验证环境配置
echo "验证环境配置..."
check_file ".env.example" "环境变量模板"
check_file ".env.docker" "Docker环境配置"

echo

# 验证部署脚本
echo "验证部署脚本..."
check_file "deploy.sh" "Linux部署脚本"
check_file "deploy.bat" "Windows部署脚本"
check_file "DOCKER_DEPLOYMENT_GUIDE.md" "部署说明文档"

echo

# Docker语法验证
echo "验证Docker配置语法..."
if command -v docker &> /dev/null; then
    cd nest-admin2
    if docker compose config &> /dev/null; then
        echo -e "${GREEN}✓${NC} Docker Compose配置语法正确"
        ((passed++))
    else
        echo -e "${RED}✗${NC} Docker Compose配置语法错误"
        echo "请运行以下命令查看详细错误："
        echo "cd nest-admin2 && docker compose config"
        ((failed++))
    fi
    cd ..
else
    echo -e "${YELLOW}!${NC} Docker未安装，跳过语法验证"
fi

echo
echo "=========================================="
echo "          验证结果汇总"
echo "=========================================="
echo -e "通过: ${GREEN}$passed${NC} 项"
echo -e "失败: ${RED}$failed${NC} 项"
echo

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 所有验证通过！项目可以进行Docker部署。${NC}"
    echo
    echo "下一步："
    echo "1. 运行部署脚本: ./deploy.sh"
    echo "2. 或手动运行: cd nest-admin2 && docker compose up -d --build"
    exit 0
else
    echo -e "${RED}❌ 有 $failed 项验证失败，请修复后再部署。${NC}"
    exit 1
fi