@echo off
REM Docker配置验证脚本 (Windows版)
echo ==========================================
echo     Docker配置验证
echo ==========================================
echo.

setlocal EnableDelayedExpansion

REM 验证计数器
set /a passed=0
set /a failed=0

REM 验证文件函数
:check_file
set "file=%~1"
set "description=%~2"
if exist "%file%" (
    echo [√] %description%: %file%
    set /a passed+=1
) else (
    echo [×] %description%: %file% ^(文件不存在^)
    set /a failed+=1
)
goto :eof

REM 验证目录函数
:check_directory
set "dir=%~1"
set "description=%~2"
if exist "%dir%" (
    echo [√] %description%: %dir%
    set /a passed+=1
) else (
    echo [!] %description%: %dir% ^(目录不存在，将自动创建^)
    mkdir "%dir%" 2>nul
    if exist "%dir%" (
        echo [√] 目录创建成功: %dir%
        set /a passed+=1
    ) else (
        echo [×] 目录创建失败: %dir%
        set /a failed+=1
    )
)
goto :eof

REM 进入脚本目录
cd /d "%~dp0"

echo 验证项目结构...
echo.

REM 验证主要目录结构
call :check_directory "front" "Vue.js前端目录"
call :check_directory "kouzi-person" "React前端目录"
call :check_directory "nest-admin2" "后端项目目录"
call :check_directory "nest-admin2\servers" "NestJS服务目录"
call :check_directory "nest-admin2\db" "数据库脚本目录"

echo.

REM 验证Dockerfile
echo 验证Dockerfile...
call :check_file "front\Dockerfile" "Vue.js前端Dockerfile"
call :check_file "kouzi-person\Dockerfile" "React前端Dockerfile"
call :check_file "nest-admin2\servers\Dockerfile" "后端Dockerfile"

echo.

REM 验证配置文件
echo 验证配置文件...
call :check_file "nest-admin2\docker-compose.yaml" "Docker Compose配置"
call :check_file "front\nginx.conf" "Vue.js前端Nginx配置"
call :check_file "kouzi-person\nginx.conf" "React前端Nginx配置"
call :check_file "nest-admin2\nginx\nginx.conf" "反向代理Nginx配置"

echo.

REM 验证数据库文件
echo 验证数据库文件...
call :check_file "nest-admin2\db\kapok.sql" "数据库初始化脚本"
call :check_file "kapok.sql" "数据库备份文件"

echo.

REM 验证包管理文件
echo 验证包管理文件...
call :check_file "front\package.json" "Vue.js前端包配置"
call :check_file "kouzi-person\package.json" "React前端包配置"
call :check_file "nest-admin2\servers\package.json" "后端包配置"

echo.

REM 验证环境配置
echo 验证环境配置...
call :check_file ".env.example" "环境变量模板"
call :check_file ".env.docker" "Docker环境配置"

echo.

REM 验证部署脚本
echo 验证部署脚本...
call :check_file "deploy.sh" "Linux部署脚本"
call :check_file "deploy.bat" "Windows部署脚本"
call :check_file "DOCKER_DEPLOYMENT_GUIDE.md" "部署说明文档"

echo.

REM Docker语法验证
echo 验证Docker配置语法...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    cd nest-admin2
    docker compose config >nul 2>&1
    if %errorlevel% equ 0 (
        echo [√] Docker Compose配置语法正确
        set /a passed+=1
    ) else (
        echo [×] Docker Compose配置语法错误
        echo 请运行以下命令查看详细错误：
        echo cd nest-admin2 ^&^& docker compose config
        set /a failed+=1
    )
    cd ..
) else (
    echo [!] Docker未安装，跳过语法验证
)

echo.
echo ==========================================
echo           验证结果汇总
echo ==========================================
echo 通过: %passed% 项
echo 失败: %failed% 项
echo.

if %failed% equ 0 (
    echo 🎉 所有验证通过！项目可以进行Docker部署。
    echo.
    echo 下一步：
    echo 1. 运行部署脚本: deploy.bat
    echo 2. 或手动运行: cd nest-admin2 ^&^& docker compose up -d --build
) else (
    echo ❌ 有 %failed% 项验证失败，请修复后再部署。
)

pause