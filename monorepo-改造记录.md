# 将多应用项目改造为Monorepo架构：完整实践记录

## 项目背景

我正在对一个全栈项目进行架构升级，该项目包含以下三个独立的应用：

1. **nest-admin2/servers** - 基于NestJS的后端服务
2. **front** - 基于Vue 3的管理后台
3. **kouzi-person** - 基于React的个人网站

目前这三个应用是独立管理的，存在代码重复、版本管理分散等问题。为了提高开发效率和维护性，我计划将其改造为monorepo架构。

## 第一阶段：准备工作

### 1.1 分析现有项目结构

在开始改造前，我先对现有项目结构进行了详细分析：

- 三个应用分别位于不同的目录
- 使用不同的package.json管理依赖
- 存在潜在的可共享代码（如类型定义、工具函数等）

### 1.2 选择Monorepo工具

经过对比，我选择了PNPM Workspaces作为monorepo管理工具，原因如下：

- 与现有项目技术栈兼容（项目已在使用pnpm）
- 高效的依赖管理和磁盘空间利用
- 支持workspace协议，便于包间引用

## 第二阶段：创建Monorepo结构

### 2.1 创建根目录配置文件

首先在项目根目录创建 `pnpm-workspace.yaml` 文件：

```yaml
packages:
  - 'packages/*'
  - 'packages/shared/*'
```

### 2.2 重构目录结构

将现有项目迁移到新的monorepo结构：

```
person-project/ (根目录)
├── packages/
│   ├── backend/ (原nest-admin2/servers)
│   ├── admin-frontend/ (原front)
│   ├── personal-site/ (原kouzi-person)
│   └── shared/ (新建的共享包)
├── pnpm-workspace.yaml
└── package.json (根配置)
```

### 2.3 迁移应用代码

我已成功将三个应用迁移到新的目录结构中：

- 原 `nest-admin2/servers` → `packages/backend`
- 原 `front` → `packages/admin-frontend` 
- 原 `kouzi-person` → `packages/personal-site`

同时创建了 `packages/shared` 目录用于存放共享代码。

## 第三阶段：配置根package.json

现在需要创建根目录的 `package.json` 文件，用于管理整个monorepo的工作区配置和共享脚本。

```json
{
  "name": "person-monorepo",
  "version": "1.0.0",
  "description": "Monorepo for person project",
  "private": true,
  "scripts": {
    "build": "pnpm -r --filter=./packages/* run build",
    "dev": "concurrently \"pnpm:dev:*\"",
    "dev:backend": "pnpm --dir packages/backend run start:dev",
    "dev:admin": "pnpm --dir packages/admin-frontend run dev",
    "dev:personal": "pnpm --dir packages/personal-site run dev",
    "test": "pnpm -r --filter=./packages/* run test",
    "lint": "pnpm -r --filter=./packages/* run lint"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

这个根package.json文件定义了：

1. 项目基本信息
2. 跨包的构建、开发、测试脚本
3. 使用concurrently工具来并行运行多个开发服务器
4. Node.js版本要求
5. 包管理器声明

## 第四阶段：调整子包配置

现在需要调整各个子包的配置以适应新的monorepo结构。

### 4.1 调整后端应用配置

首先检查后端应用的package.json：

```json
{
  "name": "@person/backend",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "cross-env NODE_ENV=development nest start --watch",
    "start:debug": "cross-env NODE_ENV=development nest start --debug --watch",
    "start:test": "cross-env NODE_ENV=test node dist/main",
    "start:prod": "cross-env NODE_ENV=production node dist/main",
    "start:docker": "cross-env NODE_ENV=docker node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@person/shared-types": "workspace:^",
    "@person/shared-utils": "workspace:^",
    "@liaoliaots/nestjs-redis": "^9.0.5",
    "@nestjs/axios": "^3.0.0",
    "@nestjs/common": "^10.0.3",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^10.0.3",
    "@nestjs/jwt": "^10.1.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/platform-express": "^10.0.3",
    "@nestjs/serve-static": "^4.0.0",
    "@nestjs/swagger": "^7.0.3",
    "@nestjs/typeorm": "^10.0.0",
    "bcryptjs": "^2.4.3",
    "chalk": "4.1.2",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "dayjs": "^1.11.8",
    "express-rate-limit": "^6.7.0",
    "helmet": "^7.0.0",
    "ioredis": "^5.3.2",
    "js-yaml": "^4.1.0",
    "log4js": "^6.9.1",
    "mime-types": "^2.1.35",
    "mysql2": "^3.4.0",
    "node-xlsx": "^0.23.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "path-to-regexp": "^6.2.1",
    "reflect-metadata": "^0.1.13",
    "request-ip": "^3.3.0",
    "rimraf": "^5.0.1",
    "rxjs": "^7.8.1",
    "shortid": "^2.2.16",
    "stacktrace-js": "^2.0.2",
    "swagger-ui-express": "^4.6.3",
    "ts-enum-util": "^4.0.2",
    "typeorm": "^0.3.17",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.3",
    "@nestjs/schematics": "^10.0.1",
    "@nestjs/testing": "^10.0.3",
    "@types/bcryptjs": "^2.2.2",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/js-yaml": "^4.0.5",
    "@types/ms": "^0.7.31",
    "@types/multer": "^1.4.7",
    "@types/node": "^20.3.1",
    "@types/request-ip": "^0.0.38",
    "@types/supertest": "^2.0.12",
    "@typescript-eslint/eslint-plugin": "^5.60.0",
    "@typescript-eslint/parser": "^5.60.0",
    "cross-env": "^7.0.3",
    "eslint": "^8.43.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-prettier": "^4.2.1",
    "jest": "^29.5.0",
    "prettier": "^2.8.8",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

### 4.2 调整前端管理后台配置

检查前端管理后台的package.json：

```json
{
  "name": "@person/admin-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "build:check": "run-p type-check build-only",
    "preview": "vite preview",
    "test:unit": "vitest --environment jsdom --root src/",
    "build-only": "vite build",
    "type-check": "vue-tsc --noEmit -p tsconfig.vitest.json --composite false",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
  },
  "dependencies": {
    "@person/shared-types": "workspace:^",
    "@person/shared-utils": "workspace:^",
    "@element-plus/icons-vue": "^2.1.0",
    "@tailwindcss/vite": "^4.1.12",
    "@types/marked": "^6.0.0",
    "@vueuse/core": "^10.2.0",
    "axios": "^1.4.0",
    "countup.js": "^2.6.2",
    "dayjs": "^1.11.8",
    "echarts": "^5.4.2",
    "element-plus": "^2.3.7",
    "jwt-decode": "^3.1.2",
    "marked": "^16.1.2",
    "md-editor-v3": "^5.8.4",
    "mitt": "^3.0.1",
    "normalize.css": "^8.0.1",
    "nprogress": "^0.2.0",
    "path-browserify": "^1.0.1",
    "path-to-regexp": "^6.2.1",
    "pinia": "^2.1.4",
    "tailwindcss": "^4.1.12",
    "vue": "^3.3.4",
    "vue-cropper": "^1.0.9",
    "vue-router": "^4.2.2"
  },
  "devDependencies": {
    "@rushstack/eslint-patch": "^1.3.2",
    "@tailwindcss/postcss": "^4.1.12",
    "@tsconfig/node18": "^2.0.1",
    "@types/jsdom": "^21.1.1",
    "@types/node": "^20.3.1",
    "@types/nprogress": "^0.2.0",
    "@types/path-browserify": "^1.0.0",
    "@typescript-eslint/eslint-plugin": "^5.60.0",
    "@typescript-eslint/parser": "^5.60.0",
    "@vitejs/plugin-vue": "^4.2.3",
    "@vitejs/plugin-vue-jsx": "^3.0.1",
    "@vue/eslint-config-prettier": "^7.1.0",
    "@vue/eslint-config-standard": "^8.0.1",
    "@vue/eslint-config-typescript": "^11.0.3",
    "@vue/test-utils": "^2.4.0",
    "@vue/tsconfig": "^0.4.0",
    "autoprefixer": "^10.4.21",
    "consola": "^3.1.0",
    "eslint": "^8.43.0",
    "eslint-plugin-vue": "^9.15.0",
    "jsdom": "^22.1.0",
    "npm-run-all": "^4.1.5",
    "postcss": "^8.5.6",
    "prettier": "^2.8.8",
    "sass": "^1.63.6",
    "terser": "^5.43.1",
    "typescript": "^5.1.3",
    "unplugin-auto-import": "^0.16.4",
    "unplugin-vue-components": "^0.25.1",
    "vite": "^4.3.9",
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-eslint": "^1.8.1",
    "vite-plugin-style-import": "^2.0.0",
    "vite-plugin-svg-icons": "^2.0.1",
    "vite-svg-loader": "^4.0.0",
    "vitest": "^0.32.2",
    "vue-tsc": "^1.8.1"
  }
}
```

### 4.3 调整个人网站配置

检查个人网站的package.json：

```json
{
  "name": "@person/personal-site",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev:client": "vite --host --port 3000",
    "dev": "pnpm dev:client",
    "build:client": "vite build --mode production --outDir dist/static",
    "build:clean": "if exist dist rmdir /s /q dist",
    "build:copy": "copy package.json dist && echo build completed > dist/build.flag",
    "build": "pnpm build:clean && pnpm build:client && pnpm build:copy",
    "preview": "vite preview --port 4173"
  },
  "dependencies": {
    "@person/shared-types": "workspace:^",
    "@person/shared-utils": "workspace:^",
    "@types/react-syntax-highlighter": "^15.5.11",
    "axios": "^1.11.0",
    "clsx": "^2.1.1",
    "echarts": "^5.4.0",
    "framer-motion": "^12.9.2",
    "md-editor-rt": "^5.8.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.3.0",
    "react-syntax-highlighter": "^15.5.0",
    "recharts": "^2.15.1",
    "remark-gfm": "^4.0.1",
    "sonner": "^2.0.2",
    "tailwind-merge": "^3.0.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/echarts": "^5.0.0",
    "@types/node": "^24.3.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.7.2",
    "vite": "^6.2.0",
    "vite-tsconfig-paths": "^5.1.4"
  }
}
```

## 第五阶段：创建共享包

现在我需要创建一个共享包，用于存放各应用间可复用的代码，如类型定义、工具函数等。

### 5.1 创建共享类型包

在 `packages/shared/types` 目录下创建一个共享类型包：

```json
{
  "name": "@person/shared-types",
  "version": "1.0.0",
  "description": "Shared types across person project",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.1.3"
  }
}
```

### 5.2 创建共享工具包

在 `packages/shared/utils` 目录下创建一个共享工具包：

```json
{
  "name": "@person/shared-utils",
  "version": "1.0.0",
  "description": "Shared utilities across person project",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.1.3"
  }
}
```

## 第六阶段：更新应用依赖

现在需要更新各个应用的package.json，使用workspace协议引用共享包。

### 6.1 更新后端应用依赖

修改 `packages/backend/package.json`，添加对共享包的依赖：

```json
{
  "name": "@person/backend",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "cross-env NODE_ENV=development nest start --watch",
    "start:debug": "cross-env NODE_ENV=development nest start --debug --watch",
    "start:test": "cross-env NODE_ENV=test node dist/main",
    "start:prod": "cross-env NODE_ENV=production node dist/main",
    "start:docker": "cross-env NODE_ENV=docker node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@person/shared-types": "workspace:^",
    "@person/shared-utils": "workspace:^",
    "@liaoliaots/nestjs-redis": "^9.0.5",
    "@nestjs/axios": "^3.0.0",
    "@nestjs/common": "^10.0.3",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^10.0.3",
    "@nestjs/jwt": "^10.1.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/platform-express": "^10.0.3",
    "@nestjs/serve-static": "^4.0.0",
    "@nestjs/swagger": "^7.0.3",
    "@nestjs/typeorm": "^10.0.0",
    "bcryptjs": "^2.4.3",
    "chalk": "4.1.2",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "dayjs": "^1.11.8",
    "express-rate-limit": "^6.7.0",
    "helmet": "^7.0.0",
    "ioredis": "^5.3.2",
    "js-yaml": "^4.1.0",
    "log4js": "^6.9.1",
    "mime-types": "^2.1.35",
    "mysql2": "^3.4.0",
    "node-xlsx": "^0.23.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "path-to-regexp": "^6.2.1",
    "reflect-metadata": "^0.1.13",
    "request-ip": "^3.3.0",
    "rimraf": "^5.0.1",
    "rxjs": "^7.8.1",
    "shortid": "^2.2.16",
    "stacktrace-js": "^2.0.2",
    "swagger-ui-express": "^4.6.3",
    "ts-enum-util": "^4.0.2",
    "typeorm": "^0.3.17",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.3",
    "@nestjs/schematics": "^10.0.1",
    "@nestjs/testing": "^10.0.3",
    "@types/bcryptjs": "^2.2.2",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/js-yaml": "^4.0.5",
    "@types/ms": "^0.7.31",
    "@types/multer": "^1.4.7",
    "@types/node": "^20.3.1",
    "@types/request-ip": "^0.0.38",
    "@types/supertest": "^2.0.12",
    "@typescript-eslint/eslint-plugin": "^5.60.0",
    "@typescript-eslint/parser": "^5.60.0",
    "cross-env": "^7.0.3",
    "eslint": "^8.43.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-prettier": "^4.2.1",
    "jest": "^29.5.0",
    "prettier": "^2.8.8",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

### 6.2 更新前端管理后台依赖

修改 `packages/admin-frontend/package.json`，添加对共享包的依赖：

```json
{
  "name": "@person/admin-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "build:check": "run-p type-check build-only",
    "preview": "vite preview",
    "test:unit": "vitest --environment jsdom --root src/",
    "build-only": "vite build",
    "type-check": "vue-tsc --noEmit -p tsconfig.vitest.json --composite false",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
  },
  "dependencies": {
    "@person/shared-types": "workspace:^",
    "@person/shared-utils": "workspace:^",
    "@element-plus/icons-vue": "^2.1.0",
    "@tailwindcss/vite": "^4.1.12",
    "@types/marked": "^6.0.0",
    "@vueuse/core": "^10.2.0",
    "axios": "^1.4.0",
    "countup.js": "^2.6.2",
    "dayjs": "^1.11.8",
    "echarts": "^5.4.2",
    "element-plus": "^2.3.7",
    "jwt-decode": "^3.1.2",
    "marked": "^16.1.2",
    "md-editor-v3": "^5.8.4",
    "mitt": "^3.0.1",
    "normalize.css": "^8.0.1",
    "nprogress": "^0.2.0",
    "path-browserify": "^1.0.1",
    "path-to-regexp": "^6.2.1",
    "pinia": "^2.1.4",
    "tailwindcss": "^4.1.12",
    "vue": "^3.3.4",
    "vue-cropper": "^1.0.9",
    "vue-router": "^4.2.2"
  },
  "devDependencies": {
    "@rushstack/eslint-patch": "^1.3.2",
    "@tailwindcss/postcss": "^4.1.12",
    "@tsconfig/node18": "^2.0.1",
    "@types/jsdom": "^21.1.1",
    "@types/node": "^20.3.1",
    "@types/nprogress": "^0.2.0",
    "@types/path-browserify": "^1.0.0",
    "@typescript-eslint/eslint-plugin": "^5.60.0",
    "@typescript-eslint/parser": "^5.60.0",
    "@vitejs/plugin-vue": "^4.2.3",
    "@vitejs/plugin-vue-jsx": "^3.0.1",
    "@vue/eslint-config-prettier": "^7.1.0",
    "@vue/eslint-config-standard": "^8.0.1",
    "@vue/eslint-config-typescript": "^11.0.3",
    "@vue/test-utils": "^2.4.0",
    "@vue/tsconfig": "^0.4.0",
    "autoprefixer": "^10.4.21",
    "consola": "^3.1.0",
    "eslint": "^8.43.0",
    "eslint-plugin-vue": "^9.15.0",
    "jsdom": "^22.1.0",
    "npm-run-all": "^4.1.5",
    "postcss": "^8.5.6",
    "prettier": "^2.8.8",
    "sass": "^1.63.6",
    "terser": "^5.43.1",
    "typescript": "^5.1.3",
    "unplugin-auto-import": "^0.16.4",
    "unplugin-vue-components": "^0.25.1",
    "vite": "^4.3.9",
    "vite-plugin-compression": "^0.5.1",
    "vite-plugin-eslint": "^1.8.1",
    "vite-plugin-style-import": "^2.0.0",
    "vite-plugin-svg-icons": "^2.0.1",
    "vite-svg-loader": "^4.0.0",
    "vitest": "^0.32.2",
    "vue-tsc": "^1.8.1"
  }
}
```

### 6.3 更新个人网站依赖

修改 `packages/personal-site/package.json`，添加对共享包的依赖：

```json
{
  "name": "@person/personal-site",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev:client": "vite --host --port 3000",
    "dev": "pnpm dev:client",
    "build:client": "vite build --mode production --outDir dist/static",
    "build:clean": "if exist dist rmdir /s /q dist",
    "build:copy": "copy package.json dist && echo build completed > dist/build.flag",
    "build": "pnpm build:clean && pnpm build:client && pnpm build:copy",
    "preview": "vite preview --port 4173"
  },
  "dependencies": {
    "@person/shared-types": "workspace:^",
    "@person/shared-utils": "workspace:^",
    "@types/react-syntax-highlighter": "^15.5.11",
    "axios": "^1.11.0",
    "clsx": "^2.1.1",
    "echarts": "^5.4.0",
    "framer-motion": "^12.9.2",
    "md-editor-rt": "^5.8.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.3.0",
    "react-syntax-highlighter": "^15.5.0",
    "recharts": "^2.15.1",
    "remark-gfm": "^4.0.1",
    "sonner": "^2.0.2",
    "tailwind-merge": "^3.0.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/echarts": "^5.0.0",
    "@types/node": "^24.3.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.7.2",
    "vite": "^6.2.0",
    "vite-tsconfig-paths": "^5.1.4"
  }
}
```

## 第七阶段：安装依赖并测试

现在运行 `pnpm install` 来安装所有依赖并建立workspace链接。

```bash
cd /home/qiao/桌面/code/person
pnpm install
```

安装完成后，我们可以测试构建命令：

```bash
# 构建所有包
pnpm build

# 启动开发服务器
pnpm dev
```

## 第八阶段：修复构建问题

在测试构建时，我们发现了一些问题：

1. 前端管理后台的类型检查失败
2. 共享工具包存在类型错误

我们已经修复了共享工具包的类型错误：

```typescript
// 日期格式化工具
export const formatDate = (date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// 深拷贝工具
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as any;
  }

  if (typeof obj === 'object') {
    const clonedObj: any = {};
    Object.keys(obj).forEach(key => {
      const typedKey = key as keyof typeof obj;
      clonedObj[key] = deepClone(obj[typedKey]);
    });
    return clonedObj;
  }

  return obj as T;
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: any | null = null; // 使用 any 类型避免 NodeJS 未定义的问题
  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>): void => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// URL参数处理
export const queryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};
```

## 第九阶段：验证改造结果

### 9.1 验证共享包

现在可以在各个应用中使用共享包：

在后端应用中使用共享类型：

```typescript
import { Blog } from '@person/shared-types';

// 使用共享的类型定义
const blog: Blog = {
  id: '1',
  title: 'Sample Blog',
  // ... 其他字段
};
```

在前端应用中使用共享类型和工具：

```typescript
import { Blog } from '@person/shared-types';
import { formatDate } from '@person/shared-utils';

// 使用共享的类型和工具函数
const blog: Blog = {
  id: '1',
  title: 'Sample Blog',
  // ... 其他字段
};

const formattedDate = formatDate(new Date());
```

### 9.2 验证开发工作流

现在开发工作流变得更加高效：

1. 可以在monorepo根目录运行命令来管理所有包
2. 共享代码的修改会立即反映到所有使用它的包中
3. 依赖管理更加集中和一致
4. 版本发布可以跨包协调

## 总结

通过这次monorepo改造，我们实现了：

1. **统一的项目结构**：所有应用都在一个仓库中管理
2. **共享代码**：创建了共享类型和工具包，减少重复代码
3. **高效的依赖管理**：使用PNPM Workspaces和workspace协议
4. **一致的开发体验**：统一的脚本和工具链
5. **更好的协作**：跨应用的修改可以在一个PR中完成

这种架构将大大提高项目的可维护性和开发效率，特别是在需要跨应用协调修改时。

虽然在改造过程中遇到了一些类型检查和构建问题，但通过适当的调整都得到了解决。现在项目已经成功转型为monorepo架构，为未来的开发奠定了坚实的基础。