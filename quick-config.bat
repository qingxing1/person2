@echo off
REM 快速配置脚本 - 部署前配置设置
echo ==========================================
echo     部署前快速配置工具
echo ==========================================
echo.

setlocal EnableDelayedExpansion

REM 获取服务器IP
set /p SERVER_IP="请输入您的服务器IP地址 (例如: 192.168.1.100): "

REM 验证IP地址格式（简单验证）
if "%SERVER_IP%"=="" (
    echo [错误] IP地址不能为空！
    pause
    exit /b 1
)

echo.
echo 正在为以下服务器配置: %SERVER_IP%
echo.

REM 创建front前端环境配置
echo [信息] 创建Vue管理后台环境配置...
if not exist "front" (
    echo [警告] front目录不存在，跳过Vue前端配置
) else (
    echo VITE_APP_BASE_API_URL=http://%SERVER_IP%:6999/api > front\.env.production
    echo VITE_APP_DOWNLOAD_URL=http://%SERVER_IP%:6999/static >> front\.env.production
    echo VITE_APP_API_REQUEST_TIMEOUT=30000 >> front\.env.production
    echo [完成] front/.env.production 已创建
)

REM 创建kouzi-person前端环境配置
echo [信息] 创建React展示前端环境配置...
if not exist "kouzi-person" (
    echo [警告] kouzi-person目录不存在，跳过React前端配置
) else (
    echo VITE_API_BASE_URL=http://%SERVER_IP%:6999/api > kouzi-person\.env.production
    echo [完成] kouzi-person/.env.production 已创建
)

REM 创建生产环境配置
echo [信息] 创建生产环境配置文件...
echo # 生产环境配置 > .env.production
echo SERVER_IP=%SERVER_IP% >> .env.production
echo ADMIN_FRONTEND_URL=http://%SERVER_IP%:9540 >> .env.production
echo KOUZI_FRONTEND_URL=http://%SERVER_IP%:3000 >> .env.production
echo BACKEND_API_URL=http://%SERVER_IP%:6999 >> .env.production
echo [完成] .env.production 已创建

echo.
echo ==========================================
echo            配置完成！
echo ==========================================
echo.
echo 服务访问地址：
echo - 管理后台: http://%SERVER_IP%:9540
echo - 展示网站: http://%SERVER_IP%:3000
echo - API服务:   http://%SERVER_IP%:6999
echo - 数据库管理: http://%SERVER_IP%:8088
echo.
echo 下一步操作：
echo 1. 确保服务器防火墙开放端口: 9540, 3000, 6999, 8088
echo 2. 运行部署脚本: deploy.bat
echo 3. 等待服务启动完成
echo 4. 访问管理后台修改默认密码
echo.
echo 防火墙配置命令（Linux服务器）：
echo sudo ufw allow 9540/tcp
echo sudo ufw allow 3000/tcp
echo sudo ufw allow 6999/tcp
echo sudo ufw allow 8088/tcp
echo.

pause