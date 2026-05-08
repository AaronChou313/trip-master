# TripMaster

TripMaster 是一个旅行规划工具，现已整理为单一仓库，包含前端应用和后端 API 两个子项目。

## 目录结构

```text
trip-master/
├── frontend/   # Vue 3 前端
├── backend/    # Express + MySQL API
└── .local/     # 本地敏感配置备份（已忽略）
```

## 核心功能

- 兴趣点搜索与收藏
- 行程创建、排序与路线展示
- 预算记录与统计
- Markdown 备忘录
- 用户注册、登录和个人信息维护
- 数据导入与导出

## 技术栈

### 前端

- Vue 3
- Vue Router 4
- Webpack 5
- Chart.js
- 高德地图 JavaScript SDK

### 后端

- Node.js
- Express
- MySQL（`mysql2`）
- JWT
- bcryptjs

## 快速开始

### 1. 准备环境变量

根目录保留了一份本地敏感备份文件：

- `.local/sensitive-backup.env`

首次初始化可参考示例文件：

```bash
cp backend/.env.example backend/.env
cp frontend/.env.development.example frontend/.env.development
cp frontend/.env.production.example frontend/.env.production
```

### 2. 启动后端

```bash
cd backend
npm install
npm run dev
```

默认地址：`http://localhost:3000`

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

默认地址：`http://localhost:8082`

开发模式下，前端会将 `/api` 代理到 `http://localhost:3000`。

## 环境变量

### 后端

见 [backend/.env.example](/home/aaron/alex/trip-master/backend/.env.example)

关键变量：

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `AMAP_API_KEY`

### 前端

见：

- [frontend/.env.example](/home/aaron/alex/trip-master/frontend/.env.example)
- [frontend/.env.development.example](/home/aaron/alex/trip-master/frontend/.env.development.example)
- [frontend/.env.production.example](/home/aaron/alex/trip-master/frontend/.env.production.example)

关键变量：

- `VUE_APP_API_BASE_URL`
- `VUE_APP_AMAP_KEY`

## 文档导航

- [frontend/README.md](/home/aaron/alex/trip-master/frontend/README.md)
- [frontend/USER_GUIDE.md](/home/aaron/alex/trip-master/frontend/USER_GUIDE.md)
- [frontend/DEPLOYMENT.md](/home/aaron/alex/trip-master/frontend/DEPLOYMENT.md)
- [backend/README.md](/home/aaron/alex/trip-master/backend/README.md)
- [backend/QUICK_START.md](/home/aaron/alex/trip-master/backend/QUICK_START.md)
- [backend/API_DOCUMENTATION.md](/home/aaron/alex/trip-master/backend/API_DOCUMENTATION.md)

## 本次整理内容

- 删除了前后端嵌套 `.git`
- 删除了前端构建产物 `frontend/dist`
- 将敏感配置集中备份到 `.local/sensitive-backup.env`
- 环境文件改为可提交的 `*.example`
- 清理并重写了前后端主要文档
