# TripMaster Backend

TripMaster 后端提供认证、兴趣点、行程、预算、备忘录和地图代理等 REST API。

## 技术栈

- Node.js
- Express
- MySQL（`mysql2`）
- JWT
- bcryptjs

## 运行要求

- Node.js 14+
- MySQL 8+ 或兼容版本
- 高德地图 API Key

## 启动方式

```bash
npm install
npm run dev
```

默认监听：`http://localhost:3000`

生产模式：

```bash
npm start
```

## 环境变量

复制示例文件并填写真实值：

```bash
cp .env.example .env
```

主要配置见 [backend/.env.example](/home/aaron/alex/trip-master/backend/.env.example)。

## 常用脚本

```bash
npm run dev
npm start
npm run db:init
npm run db:migrate
npm run db:import
```

## 接口入口

- `GET /`
- `GET /health`
- `GET /api/docs`
- `GET /api/openapi.json`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `DELETE /api/auth/me`

更多接口说明见 [backend/API_DOCUMENTATION.md](/home/aaron/alex/trip-master/backend/API_DOCUMENTATION.md)。

## 数据库

初始化 SQL 位于 [backend/config/schema.sql](/home/aaron/alex/trip-master/backend/config/schema.sql)。

当前核心表：

- `users`
- `pois`
- `itineraries`
- `itinerary_pois`
- `budgets`
- `memos`
