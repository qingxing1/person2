#!/bin/bash

# 设置所有脚本的执行权限
echo "设置脚本执行权限..."

chmod +x deploy-all.sh
chmod +x deploy-server.sh
chmod +x setup-firewall.sh
chmod +x check-status.sh
chmod +x verify-config.sh
chmod +x deploy.sh
chmod +x quick-config.sh

echo "所有脚本权限设置完成！"
echo
echo "可用的脚本："
echo "- ./deploy-all.sh     # 一键完整部署（推荐）"
echo "- ./setup-firewall.sh # 仅配置防火墙"
echo "- ./check-status.sh   # 检查服务状态"
echo "- ./verify-config.sh  # 验证配置"