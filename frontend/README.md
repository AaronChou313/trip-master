# TripMaster Frontend

TripMaster 前端是一个基于 Vue 3 的单页应用，提供地点管理、行程规划、预算管理、备忘录和用户设置界面。

## 技术栈

- Vue 3
- Vue Router 4
- Webpack 5
- Chart.js
- 高德地图 JavaScript SDK

## 运行要求

- Node.js 14+
- 后端 API 服务
- 高德地图 API Key

## 启动方式

```bash
npm install
npm run dev
```

默认访问：`http://localhost:8082`

构建生产包：

```bash
npm run build
```

## 环境变量

可参考以下示例文件：

- [frontend/.env.example](/home/aaron/alex/trip-master/frontend/.env.example)
- [frontend/.env.development.example](/home/aaron/alex/trip-master/frontend/.env.development.example)
- [frontend/.env.production.example](/home/aaron/alex/trip-master/frontend/.env.production.example)

主要变量：

- `VUE_APP_API_BASE_URL`
- `VUE_APP_AMAP_KEY`
- `NODE_ENV`

## 页面模块

- `GuideView`：使用指南
- `PoisView`：地点搜索与收藏
- `ItineraryView`：行程规划
- `BudgetView`：预算管理
- `MemosView`：备忘录
- `ProfileView`：用户资料与账户操作

## 说明

- 开发环境下 `/api` 会代理到 `http://localhost:3000`
- 应用使用 Hash 路由
- 地图相关功能依赖高德地图 SDK 和后端接口
