@echo off
REM Nest-Admin Docker部署脚本 (Windows版)
echo ========================================
echo    Nest-Admin Docker部署脚本
echo ========================================
echo.

REM 检查Docker是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Docker未安装或未启动，请先安装并启动Docker Desktop
    pause
    exit /b 1
)

REM 检查docker-compose是否可用
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Docker Compose不可用，请确保Docker Desktop正常运行
    pause
    exit /b 1
)

echo [信息] Docker环境检查通过

REM 进入项目目录
cd /d "%~dp0"

REM 创建必要的目录
if not exist "nest-admin2\nginx" mkdir "nest-admin2\nginx"
if not exist "logs" mkdir "logs"

echo [信息] 开始构建Docker镜像...

REM 进入docker-compose目录
cd nest-admin2

REM 停止现有容器
echo [信息] 停止现有容器...
docker compose down

REM 构建并启动服务
echo [信息] 构建并启动所有服务...
docker compose up -d --build

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo            部署成功!
    echo ========================================
    echo.
    echo 服务访问地址：
    echo - 管理后台前端: http://localhost:9540
    echo - 展示前端:     http://localhost:3000  
    echo - 后端API:      http://localhost:6999
    echo - 数据库管理:   http://localhost:8088
    echo.
    echo 默认登录信息：
    echo - 用户名: admin
    echo - 密码: admin
    echo.
    echo 查看服务状态: docker compose ps
    echo 查看日志: docker compose logs -f [服务名]
    echo 停止服务: docker compose down
    echo.
) else (
    echo [错误] 部署失败，请查看错误信息
)

pause