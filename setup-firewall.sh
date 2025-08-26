#!/bin/bash

# 防火墙配置脚本 - 开放必要端口
echo "=========================================="
echo "    配置防火墙端口"
echo "    服务器IP: 115.190.32.31"
echo "=========================================="
echo

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检测操作系统
if command -v ufw &> /dev/null; then
    echo -e "${BLUE}[信息] 检测到Ubuntu/Debian系统，使用ufw配置防火墙${NC}"
    
    # 开放SSH端口（确保不会断开连接）
    echo -e "${BLUE}[信息] 开放SSH端口22...${NC}"
    sudo ufw allow 22/tcp
    
    # 开放应用端口
    echo -e "${BLUE}[信息] 开放管理后台端口9540...${NC}"
    sudo ufw allow 9540/tcp
    
    echo -e "${BLUE}[信息] 开放展示网站端口3000...${NC}"
    sudo ufw allow 3000/tcp
    
    echo -e "${BLUE}[信息] 开放API服务端口6999...${NC}"
    sudo ufw allow 6999/tcp
    
    echo -e "${BLUE}[信息] 开放数据库管理端口8088...${NC}"
    sudo ufw allow 8088/tcp
    
    echo -e "${BLUE}[信息] 开放HTTP端口80...${NC}"
    sudo ufw allow 80/tcp
    
    echo -e "${BLUE}[信息] 开放HTTPS端口443...${NC}"
    sudo ufw allow 443/tcp
    
    # 启用防火墙
    echo -e "${YELLOW}[警告] 即将启用防火墙，请确保SSH连接不会中断${NC}"
    sudo ufw --force enable
    
    # 显示状态
    echo -e "${GREEN}[完成] 防火墙配置完成，当前状态：${NC}"
    sudo ufw status numbered

elif command -v firewall-cmd &> /dev/null; then
    echo -e "${BLUE}[信息] 检测到CentOS/RHEL系统，使用firewall-cmd配置防火墙${NC}"
    
    # 开放端口
    echo -e "${BLUE}[信息] 开放应用端口...${NC}"
    sudo firewall-cmd --permanent --add-port=22/tcp   # SSH
    sudo firewall-cmd --permanent --add-port=9540/tcp # 管理后台
    sudo firewall-cmd --permanent --add-port=3000/tcp # 展示网站
    sudo firewall-cmd --permanent --add-port=6999/tcp # API服务
    sudo firewall-cmd --permanent --add-port=8088/tcp # 数据库管理
    sudo firewall-cmd --permanent --add-port=80/tcp   # HTTP
    sudo firewall-cmd --permanent --add-port=443/tcp  # HTTPS
    
    # 重新载入配置
    sudo firewall-cmd --reload
    
    # 显示状态
    echo -e "${GREEN}[完成] 防火墙配置完成，当前开放端口：${NC}"
    sudo firewall-cmd --list-ports

elif command -v iptables &> /dev/null; then
    echo -e "${BLUE}[信息] 检测到其他Linux系统，使用iptables配置防火墙${NC}"
    
    # 允许已建立的连接
    sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
    
    # 允许本地回环
    sudo iptables -A INPUT -i lo -j ACCEPT
    
    # 开放端口
    sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT   # SSH
    sudo iptables -A INPUT -p tcp --dport 9540 -j ACCEPT # 管理后台
    sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT # 展示网站
    sudo iptables -A INPUT -p tcp --dport 6999 -j ACCEPT # API服务
    sudo iptables -A INPUT -p tcp --dport 8088 -j ACCEPT # 数据库管理
    sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT   # HTTP
    sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT  # HTTPS
    
    echo -e "${GREEN}[完成] iptables规则配置完成${NC}"
    echo -e "${YELLOW}[提醒] 建议保存iptables规则以防重启丢失${NC}"

else
    echo -e "${RED}[错误] 未检测到支持的防火墙工具${NC}"
    echo "请手动配置防火墙，开放以下端口："
    echo "- 22   (SSH)"
    echo "- 9540 (管理后台)"
    echo "- 3000 (展示网站)"
    echo "- 6999 (API服务)"
    echo "- 8088 (数据库管理)"
    echo "- 80   (HTTP)"
    echo "- 443  (HTTPS)"
    exit 1
fi

echo
echo "=========================================="
echo -e "${GREEN}    防火墙配置完成！${NC}"
echo "=========================================="
echo
echo "已开放的端口："
echo "- 22   (SSH)"
echo "- 9540 (管理后台)"
echo "- 3000 (展示网站)"
echo "- 6999 (API服务)"
echo "- 8088 (数据库管理)"
echo "- 80   (HTTP)"
echo "- 443  (HTTPS)"
echo
echo "服务访问地址："
echo "- 管理后台: http://115.190.32.31:9540"
echo "- 展示网站: http://115.190.32.31:3000"
echo "- API服务:   http://115.190.32.31:6999"
echo "- 数据库管理: http://115.190.32.31:8088"
echo
echo -e "${GREEN}现在可以运行部署脚本了！${NC}"